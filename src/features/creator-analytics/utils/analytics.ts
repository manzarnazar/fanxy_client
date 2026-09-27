import type {
  AnalyticsEarning,
  AnalyticsPost,
  AnalyticsRangeKey,
  AnalyticsSummary,
  PackageRevenueSlice,
  TrendPoint,
} from "@/features/creator-analytics/types/creator-analytics.types";

// All derivations here work on the already-loaded earning/post lists — the
// real backend has no analytics or date-range endpoints, so every number on
// the Analytics page is an aggregation of real transaction/post rows.

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getRangeStart(range: AnalyticsRangeKey, now: Date): Date | null {
  switch (range) {
    case "7d":
      return new Date(startOfDay(now).getTime() - 6 * 86_400_000);
    case "30d":
      return new Date(startOfDay(now).getTime() - 29 * 86_400_000);
    case "90d":
      return new Date(startOfDay(now).getTime() - 89 * 86_400_000);
    case "year":
      return new Date(now.getFullYear(), 0, 1);
    case "all":
      return null;
  }
}

export function filterEarningsByRange(
  earnings: AnalyticsEarning[],
  range: AnalyticsRangeKey,
  now: Date,
): AnalyticsEarning[] {
  const start = getRangeStart(range, now);
  if (!start) return earnings;
  const startTime = start.getTime();
  return earnings.filter((earning) => new Date(earning.createdAt).getTime() >= startTime);
}

interface BucketSpec {
  start: Date;
  bucketMs: number;
  count: number;
  label: (bucketStart: Date) => string;
}

function dayLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

function dateLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short" });
}

function monthYearLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

function buildBucketSpec(range: AnalyticsRangeKey, now: Date, earliest: Date | null): BucketSpec {
  const rangeStart = getRangeStart(range, now);

  if (range === "7d") {
    return { start: rangeStart as Date, bucketMs: 86_400_000, count: 7, label: dayLabel };
  }
  if (range === "30d") {
    return { start: rangeStart as Date, bucketMs: 5 * 86_400_000, count: 6, label: dateLabel };
  }
  if (range === "90d") {
    return { start: rangeStart as Date, bucketMs: 15 * 86_400_000, count: 6, label: dateLabel };
  }
  if (range === "year") {
    const start = rangeStart as Date;
    const monthsElapsed = now.getMonth() + 1;
    // Month lengths vary, so "year" buckets are handled by month index instead
    // of a fixed bucketMs — encode that with bucketMs = 0 and count = months.
    return { start, bucketMs: 0, count: monthsElapsed, label: monthLabel };
  }

  // Lifetime: 12 equal buckets spanning from the first-ever transaction to now.
  const start = earliest ? startOfDay(earliest) : startOfDay(now);
  const span = Math.max(now.getTime() - start.getTime(), 86_400_000);
  return { start, bucketMs: Math.ceil(span / 12), count: 12, label: span > 360 * 86_400_000 ? monthYearLabel : dateLabel };
}

/** Bucket timestamped values (transaction sums, new-subscriber counts, …) into a chartable series. */
export function bucketByTime(
  items: Array<{ createdAt: string; value: number }>,
  range: AnalyticsRangeKey,
  now: Date,
): TrendPoint[] {
  const earliest = items.length
    ? new Date(Math.min(...items.map((item) => new Date(item.createdAt).getTime())))
    : null;
  const spec = buildBucketSpec(range, now, earliest);

  const points: TrendPoint[] = Array.from({ length: spec.count }, (_, index) => {
    const bucketStart =
      spec.bucketMs === 0
        ? new Date(spec.start.getFullYear(), index, 1)
        : new Date(spec.start.getTime() + index * spec.bucketMs);
    return { label: spec.label(bucketStart), value: 0 };
  });

  for (const item of items) {
    const time = new Date(item.createdAt).getTime();
    let index: number;
    if (spec.bucketMs === 0) {
      const date = new Date(time);
      if (date.getFullYear() !== spec.start.getFullYear()) continue;
      index = date.getMonth();
    } else {
      index = Math.floor((time - spec.start.getTime()) / spec.bucketMs);
    }
    if (index < 0 || index >= spec.count) continue;
    points[index].value += item.value;
  }

  return points;
}

/**
 * A buyer's first-ever transaction (across everything loaded) marks them as a
 * new subscriber; any later transaction by the same buyer counts as a renewal.
 */
export function splitNewVsRenewal(
  allEarnings: AnalyticsEarning[],
  range: AnalyticsRangeKey,
  now: Date,
): { firstPurchases: AnalyticsEarning[]; renewals: AnalyticsEarning[] } {
  const firstAt = new Map<string, number>();
  for (const earning of allEarnings) {
    const time = new Date(earning.createdAt).getTime();
    const current = firstAt.get(earning.buyerUserId);
    if (current === undefined || time < current) firstAt.set(earning.buyerUserId, time);
  }

  const inRange = filterEarningsByRange(allEarnings, range, now);
  const firstPurchases: AnalyticsEarning[] = [];
  const renewals: AnalyticsEarning[] = [];
  for (const earning of inRange) {
    if (new Date(earning.createdAt).getTime() === firstAt.get(earning.buyerUserId)) {
      firstPurchases.push(earning);
    } else {
      renewals.push(earning);
    }
  }
  return { firstPurchases, renewals };
}

export function computePackageRevenue(earnings: AnalyticsEarning[]): PackageRevenueSlice[] {
  const totals = new Map<string, number>();
  for (const earning of earnings) {
    const key = earning.packageName ?? "Other";
    totals.set(key, (totals.get(key) ?? 0) + earning.price);
  }
  const grandTotal = Array.from(totals.values()).reduce((sum, value) => sum + value, 0);

  return Array.from(totals.entries())
    .map(([packageName, totalRevenue]) => ({
      packageName,
      totalRevenue,
      percent: grandTotal > 0 ? Math.round((totalRevenue / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
}

export function computeSummary(
  allEarnings: AnalyticsEarning[],
  posts: AnalyticsPost[],
  range: AnalyticsRangeKey,
  now: Date,
): AnalyticsSummary {
  const inRange = filterEarningsByRange(allEarnings, range, now);
  const { firstPurchases, renewals } = splitNewVsRenewal(allEarnings, range, now);

  // Active/expired reflect each buyer's LATEST transaction status across
  // everything loaded — a subscription state, not a range-scoped stat.
  const latestByBuyer = new Map<string, AnalyticsEarning>();
  for (const earning of allEarnings) {
    const current = latestByBuyer.get(earning.buyerUserId);
    if (!current || new Date(earning.createdAt).getTime() > new Date(current.createdAt).getTime()) {
      latestByBuyer.set(earning.buyerUserId, earning);
    }
  }
  const buyers = Array.from(latestByBuyer.values());

  const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.commentCount, 0);
  const interactions = totalLikes + totalComments;

  return {
    totalRevenue: inRange.reduce((sum, earning) => sum + earning.price, 0),
    transactionCount: inRange.length,
    uniqueBuyers: new Set(inRange.map((earning) => earning.buyerUserId)).size,
    newSubscribers: firstPurchases.length,
    renewals: renewals.length,
    activeSubscribers: buyers.filter((buyer) => buyer.active).length,
    expiredSubscribers: buyers.filter((buyer) => !buyer.active).length,
    totalPosts: posts.length,
    totalViews,
    totalLikes,
    totalComments,
    engagementPercent: totalViews > 0 ? Math.round((interactions / totalViews) * 1000) / 10 : 0,
    avgViewsPerPost: posts.length > 0 ? Math.round(totalViews / posts.length) : 0,
    avgLikesPerPost: posts.length > 0 ? Math.round(totalLikes / posts.length) : 0,
    avgCommentsPerPost: posts.length > 0 ? Math.round(totalComments / posts.length) : 0,
  };
}
