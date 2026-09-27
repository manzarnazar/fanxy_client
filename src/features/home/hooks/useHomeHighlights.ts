"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLiveUsers, fetchStories } from "@/store/slices/homeSlice";

export function useHomeHighlights() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const { stories, storiesStatus, liveUsers, liveUsersStatus } = useAppSelector((state) => state.home);

  useEffect(() => {
    // get_story / list_of_live_users require a real user_id on the backend —
    // skip them for guests instead of surfacing a "user id field is required" toast.
    if (!userId) return;
    void dispatch(fetchStories());
    void dispatch(fetchLiveUsers());
  }, [dispatch, userId]);

  return { stories, storiesStatus, liveUsers, liveUsersStatus };
}
