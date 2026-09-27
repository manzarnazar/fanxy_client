"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  endLiveStream,
  fetchGoLiveBundle,
  goLiveReset,
  startLiveStream,
} from "@/store/slices/goLiveSlice";
import { toast } from "@/lib/utils/toast";

export function useGoLive() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const goLive = useAppSelector((state) => state.goLive);

  // The Zego room id must be the host's Firebase document id — that's what
  // mobile viewers join via list_of_live_users.room_id.
  const roomId = user?.firebaseId ?? null;

  useEffect(() => {
    if (!user) return;
    void dispatch(fetchGoLiveBundle());
    return () => {
      dispatch(goLiveReset());
    };
  }, [dispatch, user]);

  const start = useCallback(async () => {
    if (!roomId) {
      toast.error("Live streaming needs a chat-linked account. Sign in with Google or phone once to activate it.");
      return;
    }
    const result = await dispatch(startLiveStream({ roomId }));
    if (startLiveStream.rejected.match(result)) {
      toast.error("Unable to start the live stream.");
    }
  }, [dispatch, roomId]);

  const end = useCallback(async () => {
    const result = await dispatch(endLiveStream());
    if (endLiveStream.fulfilled.match(result)) {
      toast.success("Live stream ended.");
    }
  }, [dispatch]);

  return {
    user,
    roomId,
    ...goLive,
    start,
    end,
  };
}
