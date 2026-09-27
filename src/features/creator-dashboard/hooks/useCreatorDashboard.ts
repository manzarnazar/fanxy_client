"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCreatorDashboard } from "@/store/slices/creatorDashboardSlice";

export function useCreatorDashboard() {
  const dispatch = useAppDispatch();
  const creatorId = useAppSelector((state) => state.auth.user?.id);
  const { bundle, status, error } = useAppSelector((state) => state.creatorDashboard);

  useEffect(() => {
    if (creatorId) void dispatch(fetchCreatorDashboard(creatorId));
  }, [dispatch, creatorId]);

  return {
    bundle,
    status,
    error,
    retry: () => {
      if (creatorId) void dispatch(fetchCreatorDashboard(creatorId));
    },
  };
}
