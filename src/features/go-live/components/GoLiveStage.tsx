"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Radio } from "lucide-react";
import type { ZegoLiveConfig } from "@/features/go-live/types/go-live.types";

interface GoLiveStageProps {
  config: ZegoLiveConfig;
  roomId: string;
  userName: string;
  startedAt: number;
  ending: boolean;
  onEnd: () => void;
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

export function GoLiveStage({ config, roomId, userName, startedAt, ending, onEnd }: GoLiveStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const joinedRef = useRef(false);
  const [joining, setJoining] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed(Math.round((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  useEffect(() => {
    if (joinedRef.current || !containerRef.current) return;
    joinedRef.current = true;
    let destroyed = false;
    let instance: { destroy: () => void } | null = null;

    // Zego's UIKit is browser-only — imported dynamically so it never touches SSR.
    void import("@zegocloud/zego-uikit-prebuilt").then(({ ZegoUIKitPrebuilt }) => {
      if (destroyed || !containerRef.current) return;
      // Same client-side credential model the mobile app uses (appSign there,
      // serverSecret-based kit token here) — no token server exists.
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        config.appId,
        config.serverSecret,
        roomId,
        roomId,
        userName,
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      instance = zp;
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: { role: ZegoUIKitPrebuilt.Host },
        },
        showLeaveRoomConfirmDialog: false,
        onJoinRoom: () => setJoining(false),
      });
    });

    return () => {
      destroyed = true;
      instance?.destroy();
    };
  }, [config, roomId, userName]);

  return (
    <div>
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex animate-pulse items-center gap-1.5 rounded-full bg-gradient-to-br from-secondary-light to-secondary-dark px-3 py-1 font-sans text-[11px] font-bold tracking-wide text-white uppercase">
            <Radio className="h-3.5 w-3.5" aria-hidden="true" />
            Live
          </span>
          <span className="font-sans text-[13px] font-medium text-text-primary tabular-nums">{formatDuration(elapsed)}</span>
        </div>
        <button
          type="button"
          onClick={() => setEndConfirmOpen(true)}
          className="rounded-md bg-danger px-4.5 py-2 font-sans text-[13px] font-semibold text-white transition hover:bg-danger-strong"
        >
          End Stream
        </button>
      </div>

      <div className="relative overflow-hidden rounded-[20px] border border-primary/16 bg-surface">
        {joining && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-surface">
            <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
            <p className="font-sans text-[12.5px] font-light text-text-secondary/75">Connecting to your live room…</p>
          </div>
        )}
        {/* Zego renders its full host UI (video, chat, members) into this container. */}
        <div ref={containerRef} className="h-[70vh] min-h-[480px] w-full" />
      </div>

      {endConfirmOpen && (
        <div className="fixed inset-0 z-[96] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]" onClick={() => setEndConfirmOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="End live stream"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[380px] rounded-xl border border-danger/30 bg-surface-elevated p-6 text-center shadow-dropdown"
          >
            <div className="font-display text-lg font-semibold text-text-primary">End your live stream?</div>
            <p className="mt-1.5 font-sans text-[12.5px] leading-relaxed font-light text-text-secondary">
              You&apos;ve been live for {formatDuration(elapsed)}. Fans will no longer see your stream.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setEndConfirmOpen(false)}
                className="flex-1 rounded-md border border-primary/18 bg-surface/60 px-4 py-2.5 font-sans text-[13px] font-medium text-text-secondary transition hover:bg-primary/10"
              >
                Keep Streaming
              </button>
              <button
                type="button"
                disabled={ending}
                onClick={onEnd}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-danger px-4 py-2.5 font-sans text-[13px] font-semibold text-white transition hover:bg-danger-strong disabled:opacity-60"
              >
                {ending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                End Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
