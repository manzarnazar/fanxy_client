"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteMyPost,
  deleteMyStory,
  fetchMyPosts,
  fetchMyStories,
  resetMyPosts,
  resetMyStories,
} from "@/store/slices/myContentSlice";
import type { ContentItem, ContentTab, ContentViewMode, PostStatusFilter } from "@/features/my-content/types/my-content.types";
import { toast } from "@/lib/utils/toast";

export function useMyContentFeed() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const { posts, stories } = useAppSelector((state) => state.myContent);

  const [tab, setTab] = useState<ContentTab>("post");
  const [statusFilter, setStatusFilter] = useState<PostStatusFilter>("all");
  const [viewMode, setViewMode] = useState<ContentViewMode>("grid");
  const [query, setQuery] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const list = tab === "post" ? posts : stories;

  useEffect(() => {
    if (!userId) return;
    if (tab === "post") {
      dispatch(resetMyPosts());
      void dispatch(fetchMyPosts({ userId, page: 1, append: false }));
    } else {
      dispatch(resetMyStories());
      void dispatch(fetchMyStories({ userId, page: 1, append: false }));
    }
  }, [dispatch, userId, tab]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !userId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || !list.hasMore || list.status !== "succeeded" || list.isLoadingMore) return;
        if (tab === "post") void dispatch(fetchMyPosts({ userId, page: list.page + 1, append: true }));
        else void dispatch(fetchMyStories({ userId, page: list.page + 1, append: true }));
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [dispatch, userId, tab, list.hasMore, list.status, list.isLoadingMore, list.page]);

  const filteredItems = useMemo(() => {
    let items = list.items;
    if (tab === "post" && statusFilter !== "all") {
      items = items.filter((item) => (statusFilter === "scheduled" ? item.scheduled : !item.scheduled));
    }
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      items = items.filter(
        (item) => item.title?.toLowerCase().includes(normalizedQuery) || item.description?.toLowerCase().includes(normalizedQuery),
      );
    }
    return items;
  }, [list.items, tab, statusFilter, query]);

  const topPerforming = useMemo(
    () =>
      [...posts.items]
        .sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
        .slice(0, 5),
    [posts.items],
  );

  const setTabAndReset = useCallback((next: ContentTab) => {
    setTab(next);
    setStatusFilter("all");
    setQuery("");
  }, []);

  const retry = useCallback(() => {
    if (!userId) return;
    if (tab === "post") void dispatch(fetchMyPosts({ userId, page: 1, append: false }));
    else void dispatch(fetchMyStories({ userId, page: 1, append: false }));
  }, [dispatch, userId, tab]);

  const deleteItem = useCallback(
    (item: ContentItem) => {
      if (item.kind === "post") void dispatch(deleteMyPost(item.id));
      else void dispatch(deleteMyStory(item.id));
      toast.success(`${item.kind === "post" ? "Post" : "Story"} deleted.`);
    },
    [dispatch],
  );

  return {
    userId,
    tab,
    setTab: setTabAndReset,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    query,
    setQuery,
    items: filteredItems,
    resultCount: filteredItems.length,
    postsTotalCount: posts.totalCount,
    storiesTotalCount: stories.totalCount,
    status: list.status,
    error: list.error,
    hasMore: list.hasMore,
    isLoadingMore: list.isLoadingMore,
    sentinelRef,
    retry,
    deleteItem,
    topPerforming,
  };
}
