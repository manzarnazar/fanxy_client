"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useSubscribersFeed } from "@/features/subscribers/hooks/useSubscribersFeed";
import { SubscribersHeaderBar } from "@/features/subscribers/components/SubscribersHeaderBar";
import { SubscribersKpiRow } from "@/features/subscribers/components/SubscribersKpiRow";
import { SubscribersFilterChips } from "@/features/subscribers/components/SubscribersFilterChips";
import { SubscribersToolbar } from "@/features/subscribers/components/SubscribersToolbar";
import { SubscribersSkeleton } from "@/features/subscribers/components/SubscribersSkeleton";
import { SubscribersEmptyState } from "@/features/subscribers/components/SubscribersEmptyState";
import { SubscriberCard } from "@/features/subscribers/components/SubscriberCard";
import { SubscriberListRow } from "@/features/subscribers/components/SubscriberListRow";
import { SubscriberDetailPanel } from "@/features/subscribers/components/SubscriberDetailPanel";
import { SubscribersRightSidebar } from "@/features/subscribers/components/SubscribersRightSidebar";
import type { Subscriber } from "@/features/subscribers/types/subscribers.types";

export function SubscribersPageContent() {
  const router = useRouter();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const isCreator = user?.role === "creator";
  const [refreshing, setRefreshing] = useState(false);

  const {
    subscribers,
    resultCount,
    status,
    error,
    hasMore,
    sentinelRef,
    retry,
    statusFilter,
    setStatusFilter,
    sort,
    setSort,
    viewMode,
    setViewMode,
    query,
    setQuery,
    activeCount,
    expiredCount,
    revenueLoaded,
    revenueByPackage,
    topFans,
    detailSubscriber,
    openDetail,
    closeDetail,
    toggleBlock,
  } = useSubscribersFeed();

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

  const isEmpty = status !== "loading" && status !== "failed" && subscribers.length === 0;
  const isFiltered = statusFilter !== "all" || query.trim().length > 0;

  const handleClearFilters = () => {
    setStatusFilter("all");
    setQuery("");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    retry();
    window.setTimeout(() => setRefreshing(false), 600);
  };

  const handleToggleBlock = (subscriber: Subscriber) => toggleBlock(subscriber);

  return (
    <>
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
        <div className="mx-auto max-w-[900px]">
          <SubscribersHeaderBar onRefresh={handleRefresh} refreshing={refreshing} />

          <SubscribersKpiRow
            loadedCount={subscribers.length}
            activeCount={activeCount}
            expiredCount={expiredCount}
            revenueLoaded={revenueLoaded}
            hasMore={hasMore}
          />

          <SubscribersFilterChips activeFilter={statusFilter} onSelect={setStatusFilter} activeCount={activeCount} expiredCount={expiredCount} />

          <SubscribersToolbar
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultCount={resultCount}
          />

          {status === "loading" && subscribers.length === 0 && <SubscribersSkeleton />}

          {status === "failed" && subscribers.length === 0 && (
            <SectionStateMessage
              variant="error"
              title="Couldn't load your subscribers"
              body={error ?? "Something went wrong. Please try again."}
              onRetry={retry}
              minHeightClassName="min-h-[40vh]"
            />
          )}

          {isEmpty && <SubscribersEmptyState isFiltered={isFiltered} onClear={handleClearFilters} />}

          {subscribers.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {subscribers.map((subscriber) => (
                <SubscriberCard
                  key={subscriber.userId}
                  subscriber={subscriber}
                  onOpen={() => openDetail(subscriber.userId)}
                  onToggleBlock={() => handleToggleBlock(subscriber)}
                />
              ))}
            </div>
          )}

          {subscribers.length > 0 && viewMode === "list" && (
            <div className="flex flex-col gap-2">
              {subscribers.map((subscriber) => (
                <SubscriberListRow
                  key={subscriber.userId}
                  subscriber={subscriber}
                  onOpen={() => openDetail(subscriber.userId)}
                  onToggleBlock={() => handleToggleBlock(subscriber)}
                />
              ))}
            </div>
          )}

          {hasMore && subscribers.length > 0 && (
            <div ref={sentinelRef} className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary-light" aria-hidden="true" />
            </div>
          )}
        </div>
      </main>

      <SubscribersRightSidebar revenueByPackage={revenueByPackage} topFans={topFans} />

      <SubscriberDetailPanel subscriber={detailSubscriber} onClose={closeDetail} onToggleBlock={handleToggleBlock} />
    </>
  );
}
