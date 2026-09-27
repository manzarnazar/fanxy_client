"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useCreatorDashboard } from "@/features/creator-dashboard/hooks/useCreatorDashboard";
import { CreatorDashboardHeaderBar } from "@/features/creator-dashboard/components/CreatorDashboardHeaderBar";
import { CreatorDashboardWalletStats } from "@/features/creator-dashboard/components/CreatorDashboardWalletStats";
import { CreatorDashboardPackagesGrid } from "@/features/creator-dashboard/components/CreatorDashboardPackagesGrid";
import { CreatorDashboardContentPerformance } from "@/features/creator-dashboard/components/CreatorDashboardContentPerformance";
import { CreatorDashboardScheduledPosts } from "@/features/creator-dashboard/components/CreatorDashboardScheduledPosts";
import { CreatorDashboardEarningsList } from "@/features/creator-dashboard/components/CreatorDashboardEarningsList";
import { CreatorDashboardCoinTransactions } from "@/features/creator-dashboard/components/CreatorDashboardCoinTransactions";
import { CreatorDashboardWithdrawalsPanel } from "@/features/creator-dashboard/components/CreatorDashboardWithdrawalsPanel";

export function CreatorDashboardPageContent() {
  const router = useRouter();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const { bundle, status, error, retry } = useCreatorDashboard();

  const isCreator = user?.role === "creator";

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

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto flex max-w-[900px] flex-col gap-4.5">
        <CreatorDashboardHeaderBar onRefresh={retry} refreshing={status === "loading" && Boolean(bundle)} />

        {status === "loading" && !bundle && (
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
          </div>
        )}

        {status === "failed" && !bundle && (
          <SectionStateMessage
            variant="error"
            title="Couldn't load your dashboard"
            body={error ?? "Something went wrong. Please try again."}
            onRetry={retry}
            minHeightClassName="min-h-[50vh]"
          />
        )}

        {bundle && (
          <>
            <CreatorDashboardWalletStats wallet={bundle.wallet} />
            <CreatorDashboardPackagesGrid packages={bundle.packages} />
            <CreatorDashboardContentPerformance items={bundle.contentPerformance} />
            <CreatorDashboardScheduledPosts posts={bundle.scheduledPosts} />

            <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
              <CreatorDashboardEarningsList earnings={bundle.earnings} />
              <CreatorDashboardCoinTransactions transactions={bundle.coinTransactions} />
            </div>

            <CreatorDashboardWithdrawalsPanel withdrawals={bundle.withdrawals} />
          </>
        )}
      </div>
    </main>
  );
}
