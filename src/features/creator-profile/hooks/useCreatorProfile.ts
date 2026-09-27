"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCreatorProfile,
  fetchCreatorProfilePosts,
  resetCreatorProfile,
} from "@/store/slices/creatorProfileSlice";
import { useInfiniteScrollSentinel } from "@/hooks/useInfiniteScrollSentinel";

export function useCreatorProfile(creatorId: string) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((store) => store.creatorProfile);

  useEffect(() => {
    dispatch(resetCreatorProfile());
    void dispatch(fetchCreatorProfile(creatorId));
    void dispatch(fetchCreatorProfilePosts({ creatorId, page: 1, append: false }));
    return () => {
      dispatch(resetCreatorProfile());
    };
  }, [dispatch, creatorId]);

  const loadMorePosts = useCallback(() => {
    if (state.posts.status === "loading" || !state.posts.hasMore) return;
    void dispatch(fetchCreatorProfilePosts({ creatorId, page: state.posts.page + 1, append: true }));
  }, [dispatch, creatorId, state.posts.status, state.posts.hasMore, state.posts.page]);

  const sentinelRef = useInfiniteScrollSentinel(
    state.posts.status === "succeeded" && state.posts.hasMore,
    loadMorePosts,
  );

  const retry = useCallback(() => {
    void dispatch(fetchCreatorProfile(creatorId));
    void dispatch(fetchCreatorProfilePosts({ creatorId, page: 1, append: false }));
  }, [dispatch, creatorId]);

  return {
    profile: state.profile,
    status: state.status,
    error: state.error,
    posts: state.posts,
    blockPending: state.blockPending,
    sentinelRef,
    retry,
  };
}
