"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLeaderboard } from "@/store/slices/leaderboardSlice";
import type { LeaderboardMode } from "@/features/leaderboard/types/leaderboard.types";

export function useLeaderboard(mode: LeaderboardMode, creatorId?: string) {
  const dispatch = useAppDispatch();
  const { entries, status, error } = useAppSelector((state) => state.leaderboard);

  useEffect(() => {
    void dispatch(fetchLeaderboard({ mode, creatorId }));
  }, [dispatch, mode, creatorId]);

  const retry = useCallback(() => {
    void dispatch(fetchLeaderboard({ mode, creatorId }));
  }, [dispatch, mode, creatorId]);

  return { entries, status, error, retry };
}
