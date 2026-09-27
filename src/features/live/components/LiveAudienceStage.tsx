"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import type { LiveZegoConfig } from "@/features/live/types/live.types";

interface LiveAudienceStageProps {
  config: LiveZegoConfig;
  roomId: string;
  userId: string;
  userName: string;
  onLiveEnded: () => void;
  /** Fired with the raw in-room command payload (gift broadcasts). */
  onRoomCommand: (command: string) => void;
}

export function LiveAudienceStage({
  config,
  roomId,
  userId,
  userName,
  onLiveEnded,
  onRoomCommand,
}: LiveAudienceStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const joinedRef = useRef(false);
  const [joining, setJoining] = useState(true);

  // Callbacks live in refs so the Zego room isn't torn down when they change.
  const onLiveEndedRef = useRef(onLiveEnded);
  const onRoomCommandRef = useRef(onRoomCommand);
  useEffect(() => {
    onLiveEndedRef.current = onLiveEnded;
    onRoomCommandRef.current = onRoomCommand;
  });

  useEffect(() => {
    if (joinedRef.current || !containerRef.current) return;
    joinedRef.current = true;
    let destroyed = false;
    let instance: { destroy: () => void } | null = null;

    // Zego's UIKit is browser-only — imported dynamically so it never touches SSR.
    void import("@zegocloud/zego-uikit-prebuilt").then(({ ZegoUIKitPrebuilt }) => {
      if (destroyed || !containerRef.current) return;
      // Same credential model as the host stage: the mobile app joins with
      // appSign, the web joins with a serverSecret kit token — both resolve
      // to the same Zego room, so web viewers see mobile hosts.
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        config.appId,
        config.serverSecret,
        roomId,
        userId,
        userName,
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      instance = zp;
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: { role: ZegoUIKitPrebuilt.Audience },
        },
        turnOnMicrophoneWhenJoining: false,
        turnOnCameraWhenJoining: false,
        showLeaveRoomConfirmDialog: false,
        onJoinRoom: () => setJoining(false),
        onLiveEnd: () => onLiveEndedRef.current(),
        onInRoomCommandReceived: (_fromUser: unknown, command: string) => {
          onRoomCommandRef.current(command);
        },
      });
    });

    return () => {
      destroyed = true;
      instance?.destroy();
    };
  }, [config, roomId, userId, userName]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/16 bg-black">
      <div ref={containerRef} className="h-[62vh] min-h-[380px] w-full" />
      {joining && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface">
          <Loader2 className="h-7 w-7 animate-spin text-primary-light" aria-hidden="true" />
          <span className="font-sans text-[13px] font-light text-text-secondary">Joining the stream…</span>
        </div>
      )}
    </div>
  );
}
