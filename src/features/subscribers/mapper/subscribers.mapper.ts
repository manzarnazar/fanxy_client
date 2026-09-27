import { formatRelativeTime } from "@/lib/formatter/relativeTime";
import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiEarningResult } from "@/types/api/creator-dashboard.types";
import type { ApiTopFanResult } from "@/types/api/subscribers.types";
import type {
  PackageRevenueBreakdown,
  Subscriber,
  SubscriptionTransaction,
  TopSupporter,
} from "@/features/subscribers/types/subscribers.types";

function formatExpiryLabel(expiryDate: string | null): string | null {
  if (!expiryDate) return null;
  const parsed = new Date(expiryDate);
  if (Number.isNaN(parsed.getTime())) return expiryDate;
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function mapEarningToTransaction(row: ApiEarningResult, now: Date = new Date()): SubscriptionTransaction {
  return {
    id: String(row.id),
    packageName: row.creator_package_name,
    price: row.price,
    status: row.status === 1 ? "active" : "expired",
    createdAt: row.created_at,
    dateLabel: formatRelativeTime(row.created_at, now),
    expiryLabel: formatExpiryLabel(row.expiry_date),
  };
}

// Each get_earning_list row is one purchase transaction, not a unique
// subscriber — this folds new rows into the running per-subscriber
// aggregate (lifetime spend, transaction count, latest status/package).
export function mergeSubscribers(existing: Subscriber[], rows: ApiEarningResult[], now: Date = new Date()): Subscriber[] {
  const byUserId = new Map(existing.map((subscriber) => [subscriber.userId, subscriber]));

  for (const row of rows) {
    const userId = String(row.user_id);
    const transaction = mapEarningToTransaction(row, now);
    const current = byUserId.get(userId);

    if (!current) {
      byUserId.set(userId, {
        userId,
        name: row.user_name,
        avatarUrl: sanitizeMediaUrl(row.user_image),
        packageName: row.creator_package_name,
        status: transaction.status,
        lifetimeSpend: row.price,
        transactionCount: 1,
        firstTransactionAt: row.created_at,
        lastTransactionAt: row.created_at,
        lastTransactionLabel: transaction.dateLabel,
        transactions: [transaction],
        blocked: false,
      });
      continue;
    }

    const isNewer = new Date(row.created_at).getTime() > new Date(current.lastTransactionAt).getTime();
    const isOlder = new Date(row.created_at).getTime() < new Date(current.firstTransactionAt).getTime();

    byUserId.set(userId, {
      ...current,
      packageName: isNewer ? row.creator_package_name : current.packageName,
      status: isNewer ? transaction.status : current.status,
      lifetimeSpend: current.lifetimeSpend + row.price,
      transactionCount: current.transactionCount + 1,
      firstTransactionAt: isOlder ? row.created_at : current.firstTransactionAt,
      lastTransactionAt: isNewer ? row.created_at : current.lastTransactionAt,
      lastTransactionLabel: isNewer ? transaction.dateLabel : current.lastTransactionLabel,
      transactions: [...current.transactions, transaction],
    });
  }

  return Array.from(byUserId.values()).sort(
    (a, b) => new Date(b.lastTransactionAt).getTime() - new Date(a.lastTransactionAt).getTime(),
  );
}

export function mapTopFan(row: ApiTopFanResult): TopSupporter {
  return {
    userId: String(row.user_id),
    name: row.user_full_name,
    avatarUrl: sanitizeMediaUrl(row.user_image),
    totalSpend: Number(row.total_spending) || 0,
  };
}

export function computePackageRevenueBreakdown(subscribers: Subscriber[]): PackageRevenueBreakdown[] {
  const totals = new Map<string, number>();
  for (const subscriber of subscribers) {
    const key = subscriber.packageName ?? "Other";
    totals.set(key, (totals.get(key) ?? 0) + subscriber.lifetimeSpend);
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
