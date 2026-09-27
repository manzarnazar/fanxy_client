"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark, Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useWithdrawals } from "@/features/withdrawals/hooks/useWithdrawals";
import { WithdrawalsHeaderBar } from "@/features/withdrawals/components/WithdrawalsHeaderBar";
import { WithdrawalsBalanceHero } from "@/features/withdrawals/components/WithdrawalsBalanceHero";
import { WithdrawalsToolbar } from "@/features/withdrawals/components/WithdrawalsToolbar";
import { WithdrawalRow } from "@/features/withdrawals/components/WithdrawalRow";
import { WithdrawalRequestModal } from "@/features/withdrawals/components/WithdrawalRequestModal";

export function WithdrawalsPageContent() {
  const router = useRouter();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const isCreator = user?.role === "creator";
  const [requestOpen, setRequestOpen] = useState(false);

  const feed = useWithdrawals();

  useEffect(() => {
    if (isBootstrapped && !isCreator) {
      router.replace(ROUTES.HOME);
    }
  }, [isBootstrapped, isCreator, router]);

  if (!isBootstrapped || !isCreator || !user) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  const isLoading = feed.status === "loading" || feed.status === "idle";
  const isFiltered = feed.statusFilter !== "all" || feed.query.trim().length > 0;

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[860px]">
        <WithdrawalsHeaderBar
          refreshing={isLoading}
          onRefresh={feed.refresh}
          onNewWithdrawal={() => setRequestOpen(true)}
        />

        <WithdrawalsBalanceHero
          coinBalance={user.coinBalance}
          earnedCoins={user.earnedCoins}
          walletBalance={user.walletBalance}
          pendingCoins={feed.totals.pending}
          approvedCoins={feed.totals.approved}
        />

        {isLoading ? (
          <div className="flex flex-col gap-2.5" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-[72px] animate-pulse rounded-xl border border-primary/10 bg-surface/40" />
            ))}
          </div>
        ) : feed.status === "failed" ? (
          <SectionStateMessage
            variant="error"
            title="Unable to load withdrawals"
            body={feed.error ?? "Something went wrong. Please try again."}
            onRetry={feed.refresh}
          />
        ) : !feed.hasAny ? (
          <SectionStateMessage
            variant="empty"
            icon={Landmark}
            title="No withdrawals yet"
            body="Request your first payout to see it here."
            minHeightClassName="min-h-[300px]"
          />
        ) : (
          <>
            <WithdrawalsToolbar
              statusFilter={feed.statusFilter}
              counts={feed.counts}
              onStatusFilterChange={feed.setStatusFilter}
              sort={feed.sort}
              onSortChange={feed.setSort}
              query={feed.query}
              onQueryChange={feed.setQuery}
            />

            {feed.rows.length === 0 ? (
              <SectionStateMessage
                variant="empty"
                icon={Landmark}
                title="No matching withdrawals"
                body={isFiltered ? "Try a different filter or search term." : "Request your first payout to see it here."}
                minHeightClassName="min-h-[240px]"
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                {feed.rows.map((withdrawal) => (
                  <WithdrawalRow key={withdrawal.id} withdrawal={withdrawal} />
                ))}
              </div>
            )}

            {feed.truncated && (
              <p className="mt-3 text-center font-sans text-[11px] font-light text-text-secondary/60">
                Showing the most recent requests — older history isn&apos;t loaded.
              </p>
            )}
          </>
        )}
      </div>

      <WithdrawalRequestModal
        open={requestOpen}
        user={user}
        submitting={feed.submitting}
        onClose={() => setRequestOpen(false)}
        onSubmit={feed.submit}
      />
    </main>
  );
}
