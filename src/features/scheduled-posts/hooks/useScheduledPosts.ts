"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteScheduledPost, fetchScheduledPosts } from "@/store/slices/scheduledPostsSlice";
import { toast } from "@/lib/utils/toast";
import type {
  ScheduledPost,
  ScheduledRangeFilter,
  ScheduledTypeFilter,
  ScheduledViewMode,
} from "@/features/scheduled-posts/types/scheduled-posts.types";

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function inRange(post: ScheduledPost, range: ScheduledRangeFilter, now: Date): boolean {
  const dayStart = startOfDay(now);
  const dayMs = 86_400_000;
  switch (range) {
    case "all":
      return true;
    case "today":
      return post.scheduledAtMs < dayStart + dayMs;
    case "tomorrow":
      return post.scheduledAtMs >= dayStart + dayMs && post.scheduledAtMs < dayStart + 2 * dayMs;
    case "week":
      return post.scheduledAtMs < dayStart + 7 * dayMs;
    case "month": {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
      return post.scheduledAtMs < nextMonth;
    }
  }
}

export function useScheduledPosts() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const { posts, status, error, deletingId } = useAppSelector((state) => state.scheduledPosts);

  const [viewMode, setViewMode] = useState<ScheduledViewMode>("calendar");
  const [typeFilter, setTypeFilter] = useState<ScheduledTypeFilter>("all");
  const [rangeFilter, setRangeFilter] = useState<ScheduledRangeFilter>("all");

  useEffect(() => {
    if (!userId || status !== "idle") return;
    void dispatch(fetchScheduledPosts());
  }, [dispatch, userId, status]);

  const refresh = useCallback(() => {
    void dispatch(fetchScheduledPosts());
  }, [dispatch]);

  const remove = useCallback(
    async (postId: string) => {
      const result = await dispatch(deleteScheduledPost(postId));
      if (deleteScheduledPost.fulfilled.match(result)) {
        toast.success("Scheduled post deleted.");
        return true;
      }
      return false;
    },
    [dispatch],
  );

  const derived = useMemo(() => {
    const now = new Date();
    const filtered = posts.filter((post) => {
      if (typeFilter === "posts" && post.isVideo) return false;
      if (typeFilter === "reels" && !post.isVideo) return false;
      return inRange(post, rangeFilter, now);
    });

    const dayStart = startOfDay(now);
    const dayMs = 86_400_000;
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

    return {
      filtered,
      counts: {
        total: posts.length,
        today: posts.filter((post) => post.scheduledAtMs < dayStart + dayMs).length,
        week: posts.filter((post) => post.scheduledAtMs < dayStart + 7 * dayMs).length,
        month: posts.filter((post) => post.scheduledAtMs < nextMonthStart).length,
      },
      todaysPosts: posts.filter((post) => post.scheduledAtMs < dayStart + dayMs),
      upNext: posts.slice(0, 2),
    };
  }, [posts, typeFilter, rangeFilter]);

  return {
    status,
    error,
    deletingId,
    refresh,
    remove,
    viewMode,
    setViewMode,
    typeFilter,
    setTypeFilter,
    rangeFilter,
    setRangeFilter,
    hasAny: posts.length > 0,
    ...derived,
  };
}
