"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBlockedUsers, resetBlockedUsers, unblockUser } from "@/store/slices/blockedUsersSlice";
import { toast } from "@/lib/utils/toast";
import { useInfiniteScrollSentinel } from "@/hooks/useInfiniteScrollSentinel";
import type { BlockedUser } from "@/features/blocked-users/types/blocked-users.types";

export function useBlockedUsers() {
  const dispatch = useAppDispatch();
  const isSignedIn = useAppSelector((state) => state.auth.user !== null);
  const state = useAppSelector((store) => store.blockedUsers);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isSignedIn) return; // guests get a sign-in prompt — no account-scoped fetch
    dispatch(resetBlockedUsers());
    void dispatch(fetchBlockedUsers({ page: 1, append: false }));
  }, [dispatch, isSignedIn]);

  const loadMore = useCallback(() => {
    if (state.status === "loading" || !state.hasMore) return;
    void dispatch(fetchBlockedUsers({ page: state.page + 1, append: true }));
  }, [dispatch, state.status, state.hasMore, state.page]);

  const sentinelRef = useInfiniteScrollSentinel(state.status === "succeeded" && state.hasMore, loadMore);

  // Search filters the loaded list client-side — the endpoint has no search
  // param (same behavior as the Flutter block list screen).
  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return state.items;
    return state.items.filter(
      (item) => item.name.toLowerCase().includes(trimmed) || item.username.toLowerCase().includes(trimmed),
    );
  }, [state.items, query]);

  const onUnblock = useCallback(
    (user: BlockedUser) => {
      void dispatch(unblockUser(user.blockUserId))
        .unwrap()
        .then(() => toast.success(`Unblocked ${user.name}`))
        .catch(() => undefined);
    },
    [dispatch],
  );

  const retry = useCallback(() => {
    void dispatch(fetchBlockedUsers({ page: 1, append: false }));
  }, [dispatch]);

  return {
    users: filtered,
    allCount: state.totalRows || state.items.length,
    query,
    setQuery,
    status: state.status,
    error: state.error,
    hasMore: state.hasMore,
    unblockingId: state.unblockingId,
    sentinelRef,
    onUnblock,
    retry,
  };
}
