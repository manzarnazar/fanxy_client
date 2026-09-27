"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectLiveZegoConfig } from "@/store/slices/appSettingsSlice";
import {
  fetchLiveCoinBalance,
  fetchLiveGifts,
  fetchLiveHostProfile,
  resetLiveWatch,
} from "@/store/slices/liveSlice";

export type LiveAccessState = "checking" | "needs-auth" | "needs-subscription" | "needs-upgrade" | "allowed" | "failed";

export function useLiveWatch(hostId: string) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isBootstrapped = useAppSelector((state) => state.auth.isBootstrapped);
  const zegoConfig = useAppSelector(selectLiveZegoConfig);
  const { watch, gifts, coinBalance, giftSending } = useAppSelector((state) => state.live);

  useEffect(() => {
    void dispatch(fetchLiveHostProfile(hostId));
    return () => {
      dispatch(resetLiveWatch());
    };
  }, [dispatch, hostId]);

  useEffect(() => {
    if (!user) return;
    void dispatch(fetchLiveGifts());
    void dispatch(fetchLiveCoinBalance(user.id));
  }, [dispatch, user]);

  const profile = watch.hostProfile;
  const isOwnStream = user !== null && user.id === hostId;

  // Mirrors the Flutter double gate (livestreams.dart watchLive):
  // creators need an active subscription, and the subscribed package must
  // include live-stream access (can_view_live_stream).
  let access: LiveAccessState = "checking";
  if (watch.status === "failed") access = "failed";
  else if (watch.status === "succeeded" && profile) {
    if (isOwnStream) access = "allowed";
    else if (isBootstrapped && !user) access = "needs-auth";
    else if (profile.isCreator && !profile.subscribed) access = "needs-subscription";
    else if (profile.isCreator && !profile.canViewLiveStream) access = "needs-upgrade";
    else access = "allowed";
  }

  return {
    user,
    profile,
    error: watch.error,
    access,
    zegoConfig,
    gifts: gifts.items,
    coinBalance,
    giftSending,
  };
}
