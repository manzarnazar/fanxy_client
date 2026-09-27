"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAnalyticsBundle, setAnalyticsRange } from "@/store/slices/creatorAnalyticsSlice";
import {
  bucketByTime,
  computePackageRevenue,
  computeSummary,
  filterEarningsByRange,
  splitNewVsRenewal,
} from "@/features/creator-analytics/utils/analytics";
import type { AnalyticsRangeKey } from "@/features/creator-analytics/types/creator-analytics.types";

export function useCreatorAnalytics() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const { earnings, earningsTruncated, posts, postsTruncated, topFans, range, status, error } = useAppSelector(
    (state) => state.creatorAnalytics,
  );

  useEffect(() => {
    if (!userId || status !== "idle") return;
    void dispatch(fetchAnalyticsBundle());
  }, [dispatch, userId, status]);

  const refresh = useCallback(() => {
    void dispatch(fetchAnalyticsBundle());
  }, [dispatch]);

  const setRange = useCallback(
    (nextRange: AnalyticsRangeKey) => {
      dispatch(setAnalyticsRange(nextRange));
    },
    [dispatch],
  );

  const derived = useMemo(() => {
    const now = new Date();
    const inRange = filterEarningsByRange(earnings, range, now);
    const { firstPurchases } = splitNewVsRenewal(earnings, range, now);

    return {
      summary: computeSummary(earnings, posts, range, now),
      earningsTrend: bucketByTime(
        inRange.map((earning) => ({ createdAt: earning.createdAt, value: earning.price })),
        range,
        now,
      ),
      subscriberTrend: bucketByTime(
        firstPurchases.map((earning) => ({ createdAt: earning.createdAt, value: 1 })),
        range,
        now,
      ),
      revenueByPackage: computePackageRevenue(inRange),
      topPosts: [...posts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 3),
    };
  }, [earnings, posts, range]);

  return {
    status,
    error,
    range,
    setRange,
    refresh,
    topFans,
    earningsTruncated,
    postsTruncated,
    hasAnyData: earnings.length > 0 || posts.length > 0,
    ...derived,
  };
}
