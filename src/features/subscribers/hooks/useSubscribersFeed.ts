"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSubscribers,
  fetchTopFans,
  resetSubscribers,
  toggleSubscriberBlock,
} from "@/store/slices/subscribersSlice";
import { computePackageRevenueBreakdown } from "@/features/subscribers/mapper/subscribers.mapper";
import type {
  Subscriber,
  SubscribersSort,
  SubscribersStatusFilter,
  SubscribersViewMode,
} from "@/features/subscribers/types/subscribers.types";
import { toast } from "@/lib/utils/toast";

function sortSubscribers(subscribers: Subscriber[], sort: SubscribersSort): Subscriber[] {
  const sorted = [...subscribers];
  switch (sort) {
    case "revenue":
      return sorted.sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
    case "alphabetical":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "longest":
      return sorted.sort((a, b) => new Date(a.firstTransactionAt).getTime() - new Date(b.firstTransactionAt).getTime());
    case "recent":
    default:
      return sorted.sort((a, b) => new Date(b.lastTransactionAt).getTime() - new Date(a.lastTransactionAt).getTime());
  }
}

export function useSubscribersFeed() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const { subscribers, status, error, hasMore, isLoadingMore, page, topFans, topFansStatus } = useAppSelector(
    (state) => state.subscribers,
  );

  const [statusFilter, setStatusFilter] = useState<SubscribersStatusFilter>("all");
  const [sort, setSort] = useState<SubscribersSort>("recent");
  const [viewMode, setViewMode] = useState<SubscribersViewMode>("grid");
  const [query, setQuery] = useState("");
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userId) return;
    dispatch(resetSubscribers());
    void dispatch(fetchSubscribers({ page: 1, append: false }));
    void dispatch(fetchTopFans(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && status === "succeeded" && !isLoadingMore) {
          void dispatch(fetchSubscribers({ page: page + 1, append: true }));
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [dispatch, hasMore, status, isLoadingMore, page]);

  const filteredSubscribers = useMemo(() => {
    let items = subscribers;
    if (statusFilter !== "all") items = items.filter((subscriber) => subscriber.status === statusFilter);
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      items = items.filter(
        (subscriber) =>
          subscriber.name.toLowerCase().includes(normalizedQuery) ||
          subscriber.packageName?.toLowerCase().includes(normalizedQuery),
      );
    }
    return sortSubscribers(items, sort);
  }, [subscribers, statusFilter, query, sort]);

  const activeCount = useMemo(() => subscribers.filter((s) => s.status === "active").length, [subscribers]);
  const expiredCount = subscribers.length - activeCount;
  const revenueLoaded = useMemo(() => subscribers.reduce((sum, s) => sum + s.lifetimeSpend, 0), [subscribers]);
  const revenueByPackage = useMemo(() => computePackageRevenueBreakdown(subscribers), [subscribers]);

  const detailSubscriber = useMemo(
    () => subscribers.find((subscriber) => subscriber.userId === detailUserId) ?? null,
    [subscribers, detailUserId],
  );

  const retry = useCallback(() => {
    void dispatch(fetchSubscribers({ page: 1, append: false }));
  }, [dispatch]);

  const toggleBlock = useCallback(
    (subscriber: Subscriber) => {
      void dispatch(toggleSubscriberBlock(subscriber.userId));
      toast.success(subscriber.blocked ? `${subscriber.name} unblocked.` : `${subscriber.name} blocked.`);
    },
    [dispatch],
  );

  return {
    subscribers: filteredSubscribers,
    resultCount: filteredSubscribers.length,
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
    topFansStatus,
    detailSubscriber,
    openDetail: setDetailUserId,
    closeDetail: () => setDetailUserId(null),
    toggleBlock,
  };
}
