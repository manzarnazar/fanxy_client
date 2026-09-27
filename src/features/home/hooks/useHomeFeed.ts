"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFeed, resetFeed, toggleLike } from "@/store/slices/homeSlice";

export function useHomeFeed() {
  const dispatch = useAppDispatch();
  const feed = useAppSelector((state) => state.home.feed);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(resetFeed());
    void dispatch(fetchFeed({ page: 1, append: false }));
  }, [dispatch]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting;
        if (isVisible && feed.hasMore && feed.status === "succeeded" && !feed.isLoadingMore) {
          void dispatch(fetchFeed({ page: feed.page + 1, append: true }));
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [dispatch, feed.hasMore, feed.status, feed.isLoadingMore, feed.page]);

  const retry = () => {
    void dispatch(fetchFeed({ page: 1, append: false }));
  };

  return {
    posts: feed.posts,
    status: feed.status,
    error: feed.error,
    hasMore: feed.hasMore,
    isLoadingMore: feed.isLoadingMore,
    sentinelRef,
    retry,
    onToggleLike: (postId: string) => void dispatch(toggleLike(postId)),
  };
}
