"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMySubscriptions } from "@/store/slices/subscriptionsSlice";
import type {
  Subscription,
  SubscriptionStatusFilter,
  SubscriptionsSort,
} from "@/features/subscriptions/types/subscriptions.types";

const EXPIRING_SOON_DAYS = 7;

function isExpiringSoon(subscription: Subscription): boolean {
  return subscription.active && subscription.daysLeft !== null && subscription.daysLeft <= EXPIRING_SOON_DAYS;
}

function sortRows(rows: Subscription[], sort: SubscriptionsSort): Subscription[] {
  const sorted = [...rows];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case "expiry":
      return sorted.sort((a, b) => (a.daysLeft ?? Number.MAX_SAFE_INTEGER) - (b.daysLeft ?? Number.MAX_SAFE_INTEGER));
  }
}

export function useSubscriptions() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { subscriptions, truncated, status, error } = useAppSelector((state) => state.subscriptions);

  const [statusFilter, setStatusFilter] = useState<SubscriptionStatusFilter>("all");
  const [sort, setSort] = useState<SubscriptionsSort>("newest");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user || status !== "idle") return;
    void dispatch(fetchMySubscriptions());
  }, [dispatch, user, status]);

  const refresh = useCallback(() => {
    void dispatch(fetchMySubscriptions());
  }, [dispatch]);

  const derived = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const filtered = subscriptions.filter((subscription) => {
      if (statusFilter === "active" && !subscription.active) return false;
      if (statusFilter === "expired" && subscription.active) return false;
      if (statusFilter === "expiring" && !isExpiringSoon(subscription)) return false;
      if (
        trimmed &&
        !subscription.creatorName.toLowerCase().includes(trimmed) &&
        !subscription.packageName.toLowerCase().includes(trimmed) &&
        !(subscription.transactionId ?? "").toLowerCase().includes(trimmed)
      ) {
        return false;
      }
      return true;
    });

    // Favorite creator + top creators = where the fan's money actually went.
    const spendByCreator = new Map<string, { name: string; avatarUrl: string | null; total: number }>();
    for (const subscription of subscriptions) {
      const current = spendByCreator.get(subscription.creatorId);
      spendByCreator.set(subscription.creatorId, {
        name: subscription.creatorName,
        avatarUrl: current?.avatarUrl ?? subscription.creatorAvatarUrl,
        total: (current?.total ?? 0) + subscription.price,
      });
    }
    const topCreators = Array.from(spendByCreator.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const monthSpend = subscriptions
      .filter((subscription) => new Date(subscription.createdAt).getTime() >= monthStart)
      .reduce((sum, subscription) => sum + subscription.price, 0);

    return {
      rows: sortRows(filtered, sort),
      counts: {
        all: subscriptions.length,
        active: subscriptions.filter((subscription) => subscription.active).length,
        expiring: subscriptions.filter(isExpiringSoon).length,
        expired: subscriptions.filter((subscription) => !subscription.active).length,
      },
      lifetimeSpend: subscriptions.reduce((sum, subscription) => sum + subscription.price, 0),
      monthSpend,
      favoriteCreator: topCreators[0]?.name ?? null,
      topCreators,
      upcomingRenewals: subscriptions
        .filter((subscription) => subscription.active && subscription.daysLeft !== null)
        .sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0))
        .slice(0, 3),
      recentActivity: [...subscriptions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    };
  }, [subscriptions, statusFilter, sort, query]);

  return {
    user,
    status,
    error,
    truncated,
    refresh,
    statusFilter,
    setStatusFilter,
    sort,
    setSort,
    query,
    setQuery,
    hasAny: subscriptions.length > 0,
    ...derived,
  };
}
