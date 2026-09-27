"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useCreatorAnalytics } from "@/features/creator-analytics/hooks/useCreatorAnalytics";
import { AnalyticsHeaderBar } from "@/features/creator-analytics/components/AnalyticsHeaderBar";
import { AnalyticsRangePills } from "@/features/creator-analytics/components/AnalyticsRangePills";
import { AnalyticsKpiGrid } from "@/features/creator-analytics/components/AnalyticsKpiGrid";
import { AnalyticsEarningsCard } from "@/features/creator-analytics/components/AnalyticsEarningsCard";
import { AnalyticsRevenueByPackageCard } from "@/features/creator-analytics/components/AnalyticsRevenueByPackageCard";
import { AnalyticsAudienceCard } from "@/features/creator-analytics/components/AnalyticsAudienceCard";
import { AnalyticsTopSupportersCard } from "@/features/creator-analytics/components/AnalyticsTopSupportersCard";
import { AnalyticsContentStatsCard } from "@/features/creator-analytics/components/AnalyticsContentStatsCard";
import { AnalyticsTopContentCard } from "@/features/creator-analytics/components/AnalyticsTopContentCard";
import { AnalyticsSkeleton } from "@/features/creator-analytics/components/AnalyticsSkeleton";

export function AnalyticsPageContent() {
  const router = useRouter();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const isCreator = user?.role === "creator";

  const {
    status,
    error,
    range,
    setRange,
    refresh,
    summary,
    earningsTrend,
    subscriberTrend,
    revenueByPackage,
    topPosts,
    topFans,
    earningsTruncated,
    postsTruncated,
    hasAnyData,
  } = useCreatorAnalytics();

  useEffect(() => {
    if (isBootstrapped && !isCreator) {
      router.replace(ROUTES.HOME);
    }
  }, [isBootstrapped, isCreator, router]);

  if (!isBootstrapped || !isCreator) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  const isLoading = status === "loading" || status === "idle";
  const isEmpty = status === "succeeded" && !hasAnyData;

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[1060px]">
        <AnalyticsHeaderBar refreshing={isLoading} onRefresh={refresh} />

        {isLoading ? (
          <AnalyticsSkeleton />
        ) : status === "failed" ? (
          <SectionStateMessage
            variant="error"
            title="Unable to load analytics"
            body={error ?? "Something went wrong while loading your analytics."}
            onRetry={refresh}
          />
        ) : isEmpty ? (
          <SectionStateMessage
            variant="empty"
            icon={BarChart3}
            title="No analytics yet"
            body="Publish content and start earning — your numbers will show up here."
            emptyHref={ROUTES.UPLOAD_POST}
            emptyLabel="Create Content"
          />
        ) : (
          <>
            <AnalyticsRangePills range={range} onChange={setRange} />
            <AnalyticsKpiGrid summary={summary} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
              <AnalyticsEarningsCard totalRevenue={summary.totalRevenue} trend={earningsTrend} truncated={earningsTruncated} />
              <AnalyticsRevenueByPackageCard slices={revenueByPackage} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
              <AnalyticsAudienceCard summary={summary} trend={subscriberTrend} />
              <AnalyticsTopSupportersCard topFans={topFans} />
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <AnalyticsContentStatsCard summary={summary} truncated={postsTruncated} />
              <AnalyticsTopContentCard posts={topPosts} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
