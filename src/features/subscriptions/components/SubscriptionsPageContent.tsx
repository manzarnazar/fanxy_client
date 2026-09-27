"use client";

import { Crown, Loader2, RefreshCw, Search, X } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { useSubscriptions } from "@/features/subscriptions/hooks/useSubscriptions";
import { SubscriptionCard } from "@/features/subscriptions/components/SubscriptionCard";
import { SubscriptionsRightRail } from "@/features/subscriptions/components/SubscriptionsRightRail";
import type {
  SubscriptionStatusFilter,
  SubscriptionsSort,
} from "@/features/subscriptions/types/subscriptions.types";

const STATUS_SEGMENTS: Array<{ key: SubscriptionStatusFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "expiring", label: "Expiring Soon" },
  { key: "expired", label: "Expired" },
];

const SORT_OPTIONS: Array<{ key: SubscriptionsSort; label: string }> = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "expiry", label: "Expiry date" },
];

export function SubscriptionsPageContent() {
  const { isBootstrapped } = useAppSelector((state) => state.auth);
  const feed = useSubscriptions();

  if (!isBootstrapped) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  if (!feed.user) {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[680px]">
          <SectionStateMessage
            variant="empty"
            title="Sign in to see your subscriptions"
            body="Your creator memberships live in your account."
            emptyHref={ROUTES.SIGN_IN}
            emptyLabel="Sign In"
          />
        </div>
      </main>
    );
  }

  const isLoading = feed.status === "loading" || feed.status === "idle";
  const isFiltered = feed.statusFilter !== "all" || feed.query.trim().length > 0;

  const kpis = [
    { key: "active", value: formatCount(feed.counts.active), label: "Active subscriptions" },
    { key: "expiring", value: formatCount(feed.counts.expiring), label: "Renewing soon" },
    { key: "expired", value: formatCount(feed.counts.expired), label: "Expired" },
    { key: "month", value: `$${formatCount(feed.monthSpend)}`, label: "Spent this month" },
    { key: "favorite", value: feed.favoriteCreator ?? "—", label: "Favorite creator" },
    { key: "total", value: formatCount(feed.counts.all), label: "Total memberships" },
  ];

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto flex max-w-[1180px] gap-5">
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-[26px] leading-tight font-semibold text-text-primary">
                Subscription Management
              </h1>
              <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
                Manage your creator memberships and renewals.
              </p>
            </div>
            <button
              type="button"
              onClick={feed.refresh}
              disabled={isLoading}
              title="Refresh"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/12 hover:text-text-primary disabled:opacity-60"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} aria-hidden="true" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-4" aria-hidden="true">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-[88px] animate-pulse rounded-xl border border-primary/10 bg-surface/40" />
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-[180px] animate-pulse rounded-[20px] border border-primary/10 bg-surface/40" />
                ))}
              </div>
            </div>
          ) : feed.status === "failed" ? (
            <SectionStateMessage
              variant="error"
              title="Unable to load subscriptions"
              body={feed.error ?? "Something went wrong. Please try again."}
              onRetry={feed.refresh}
            />
          ) : !feed.hasAny ? (
            <SectionStateMessage
              variant="empty"
              icon={Crown}
              title="No subscriptions yet"
              body="Subscribe to a creator to unlock their exclusive content — your memberships will show up here."
              emptyHref={ROUTES.HOME}
              emptyLabel="Explore Creators"
            />
          ) : (
            <>
              <div className="mb-4.5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {kpis.map((kpi) => (
                  <div key={kpi.key} className="rounded-xl border border-primary/14 bg-surface/50 p-3.5">
                    <div className="truncate font-display text-xl font-semibold text-text-primary"><AnimatedNumber value={kpi.value} /></div>
                    <div className="mt-0.5 font-sans text-[11.5px] font-light text-text-secondary/70">{kpi.label}</div>
                  </div>
                ))}
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2.5">
                <div className="flex rounded-md border border-primary/16 bg-surface/60 p-0.5">
                  {STATUS_SEGMENTS.map((segment) => (
                    <button
                      key={segment.key}
                      type="button"
                      onClick={() => feed.setStatusFilter(segment.key)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-sans text-[12px] font-medium whitespace-nowrap transition",
                        feed.statusFilter === segment.key
                          ? "bg-primary/16 text-primary-light"
                          : "text-text-secondary hover:text-text-primary",
                      )}
                    >
                      {segment.label}
                      <span className="font-sans text-[10px] font-semibold opacity-70">{feed.counts[segment.key]}</span>
                    </button>
                  ))}
                </div>

                <div className="flex h-10 min-w-[180px] flex-1 items-center gap-2 rounded-md border border-primary/16 bg-surface/60 px-3 focus-within:border-primary/45">
                  <Search className="h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
                  <input
                    value={feed.query}
                    onChange={(event) => feed.setQuery(event.target.value)}
                    placeholder="Search creator, package, transaction…"
                    aria-label="Search subscriptions"
                    className="min-w-0 flex-1 bg-transparent font-sans text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                  {feed.query.length > 0 && (
                    <button type="button" onClick={() => feed.setQuery("")} aria-label="Clear search" className="text-text-secondary">
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <select
                  value={feed.sort}
                  onChange={(event) => feed.setSort(event.target.value as SubscriptionsSort)}
                  aria-label="Sort subscriptions"
                  className="h-10 rounded-md border border-primary/16 bg-surface/60 px-3 font-sans text-[12.5px] text-text-secondary focus:border-primary/45 focus:outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key} className="bg-surface-elevated">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {feed.rows.length === 0 ? (
                <SectionStateMessage
                  variant="empty"
                  icon={Crown}
                  title="No subscriptions found"
                  body={isFiltered ? "No subscriptions match this filter." : "Subscribe to a creator to get started."}
                  minHeightClassName="min-h-[240px]"
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {feed.rows.map((subscription) => (
                    <SubscriptionCard key={subscription.id} subscription={subscription} />
                  ))}
                </div>
              )}

              {feed.truncated && (
                <p className="mt-3 text-center font-sans text-[11px] font-light text-text-secondary/60">
                  Showing the most recent memberships — older history isn&apos;t loaded.
                </p>
              )}
            </>
          )}
        </div>

        {!isLoading && feed.status === "succeeded" && feed.hasAny && (
          <SubscriptionsRightRail
            counts={feed.counts}
            monthSpend={feed.monthSpend}
            favoriteCreator={feed.favoriteCreator}
            topCreators={feed.topCreators}
            upcomingRenewals={feed.upcomingRenewals}
            recentActivity={feed.recentActivity}
          />
        )}
      </div>
    </main>
  );
}
