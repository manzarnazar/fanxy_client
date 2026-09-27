"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNotifications, markNotificationRead, resetNotifications } from "@/store/slices/notificationsSlice";
import { NOTIFICATION_GROUP_DEFS } from "@/features/notifications/constants/notifications";
import type { NotificationGroup } from "@/features/notifications/types/notifications.types";
import { toast } from "@/lib/utils/toast";

export function useNotificationsFeed() {
  const dispatch = useAppDispatch();
  const notificationsState = useAppSelector((state) => state.notifications);
  const [refreshing, setRefreshing] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const isSignedIn = useAppSelector((state) => state.auth.user !== null);

  useEffect(() => {
    if (!isSignedIn) return; // guests get a sign-in prompt — no account-scoped fetch
    dispatch(resetNotifications());
    void dispatch(fetchNotifications({ page: 1, append: false }));
  }, [dispatch, isSignedIn]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry?.isIntersecting &&
          notificationsState.hasMore &&
          notificationsState.status === "succeeded" &&
          !notificationsState.isLoadingMore
        ) {
          void dispatch(fetchNotifications({ page: notificationsState.page + 1, append: true }));
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [dispatch, notificationsState.hasMore, notificationsState.status, notificationsState.isLoadingMore, notificationsState.page]);

  const groups = useMemo<NotificationGroup[]>(
    () =>
      NOTIFICATION_GROUP_DEFS.map((def) => ({
        key: def.key,
        label: def.label,
        items: notificationsState.items.filter((item) => item.groupKey === def.key),
      })).filter((group) => group.items.length > 0),
    [notificationsState.items],
  );

  const retry = useCallback(() => {
    void dispatch(fetchNotifications({ page: 1, append: false }));
  }, [dispatch]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    void dispatch(fetchNotifications({ page: 1, append: false })).finally(() => {
      setRefreshing(false);
      toast.info("Notifications refreshed.");
    });
  }, [dispatch]);

  const markRead = useCallback((id: string) => void dispatch(markNotificationRead(id)), [dispatch]);

  return {
    groups,
    status: notificationsState.status,
    error: notificationsState.error,
    isLoadingMore: notificationsState.isLoadingMore,
    hasMore: notificationsState.hasMore,
    sentinelRef,
    retry,
    refresh,
    refreshing,
    markRead,
  };
}
