"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSettings } from "@/store/slices/settingsSlice";

export function useSettingsData() {
  const dispatch = useAppDispatch();
  const { bundle, status, error } = useAppSelector((state) => state.settings);

  const isSignedIn = useAppSelector((state) => state.auth.user !== null);

  useEffect(() => {
    if (!isSignedIn) return; // guests get a sign-in prompt — no account-scoped fetch
    void dispatch(fetchSettings());
  }, [dispatch, isSignedIn]);

  return {
    bundle,
    status,
    error,
    retry: () => void dispatch(fetchSettings()),
  };
}
