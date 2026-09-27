"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLiveStreams } from "@/store/slices/liveSlice";
import { useInfiniteScrollSentinel } from "@/hooks/useInfiniteScrollSentinel";

export function useLiveStreams() {
  const dispatch = useAppDispatch();
  const streams = useAppSelector((state) => state.live.streams);

  useEffect(() => {
    void dispatch(fetchLiveStreams({ page: 1, append: false }));
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (streams.status === "loading" || !streams.hasMore) return;
    void dispatch(fetchLiveStreams({ page: streams.page + 1, append: true }));
  }, [dispatch, streams.status, streams.hasMore, streams.page]);

  const sentinelRef = useInfiniteScrollSentinel(streams.status === "succeeded" && streams.hasMore, loadMore);

  const retry = useCallback(() => {
    void dispatch(fetchLiveStreams({ page: 1, append: false }));
  }, [dispatch]);

  return { ...streams, sentinelRef, retry };
}
