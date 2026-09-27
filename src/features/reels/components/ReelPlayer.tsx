"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gauge, Lock, Loader2, Maximize, Pause, Play, User, Volume2, VolumeX } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils/cn";
import { formatDuration } from "@/lib/formatter/duration";
import { ROUTES } from "@/lib/constants/routes";
import { useReelPlayer } from "@/features/reels/hooks/useReelPlayer";
import type { Reel } from "@/features/reels/types/reels.types";

export interface ReelPlayerHandle {
  togglePlay: () => void;
  toggleMute: () => void;
}

interface ReelPlayerProps {
  reel: Reel;
  isActive: boolean;
  isFollowPending: boolean;
  onToggleFollow: () => void;
  onToggleLike: () => void;
}

export const ReelPlayer = forwardRef<ReelPlayerHandle, ReelPlayerProps>(function ReelPlayer(
  { reel, isActive, onToggleFollow, onToggleLike },
  ref,
) {
  const player = useReelPlayer({ autoPlay: isActive });
  // Your own reels are always visible regardless of is_buy.
  const currentUserId = useAppSelector((state) => state.auth.user?.id ?? null);
  const isLocked = reel.locked && reel.creatorId !== currentUserId;
  const {
    videoRef,
    containerRef,
    playing,
    muted,
    volume,
    speed,
    progress,
    currentTime,
    duration,
    isBuffering,
    hasError,
    togglePlay,
    toggleMute,
    setVolume,
    cycleSpeed,
    seekTo,
    videoHandlers,
  } = player;
  const [heartBurstKey, setHeartBurstKey] = useState(0);
  const [heartVisible, setHeartVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    togglePlay,
    toggleMute,
  }));

  const handleDoubleClick = () => {
    if (!reel.likedByMe) onToggleLike();
    setHeartBurstKey((prev) => prev + 1);
    setHeartVisible(true);
    window.setTimeout(() => setHeartVisible(false), 700);
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void container.requestFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[9/16] w-full max-w-[378px] overflow-hidden rounded-xl border border-primary/20 bg-surface-elevated shadow-[0_40px_90px_-40px_rgba(0,0,0,.85)] sm:w-[378px]"
    >
      <button
        type="button"
        onClick={togglePlay}
        onDoubleClick={handleDoubleClick}
        aria-label={playing ? "Pause reel" : "Play reel"}
        className="absolute inset-0 z-[4] block h-full w-full"
      >
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          loop
          playsInline
          {...videoHandlers}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 from-0% via-transparent via-22% to-black/90" />
      </button>

      {isBuffering && !hasError && (
        <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-white/80" aria-hidden="true" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 z-[6] flex flex-col items-center justify-center gap-2 bg-surface-elevated px-6 text-center">
          <p className="font-sans text-sm text-text-secondary">This reel couldn&apos;t be played.</p>
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 z-[6] flex flex-col items-center justify-center gap-1 bg-surface-elevated/90 px-8 text-center backdrop-blur-2xl">
          <span className="mb-4 flex h-[74px] w-[74px] items-center justify-center rounded-xl bg-gradient-to-br from-[#ff8fc0] to-[#c2185b] shadow-[0_20px_40px_-14px_rgba(226,29,91,.6)]">
            <Lock className="h-[34px] w-[34px] text-white" aria-hidden="true" />
          </span>
          <div className="font-display text-2xl font-semibold text-text-primary">Subscriber-only reel</div>
          <p className="mt-1 font-sans text-[13px] leading-relaxed text-text-secondary">
            Subscribe to {reel.creatorFullName} to unlock this reel and all exclusive content.
          </p>
          <Link
            href={ROUTES.SUBSCRIBE_PLANS(reel.creatorId, reel.creatorFullName)}
            className="mt-5 flex items-center gap-2 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark px-6.5 py-3 font-sans text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(226,29,91,.7)]"
          >
            Subscribe to unlock
          </Link>
        </div>
      )}

      {heartVisible && (
        <span
          key={heartBurstKey}
          className="pointer-events-none absolute top-1/2 left-1/2 z-[6] -translate-x-1/2 -translate-y-1/2 animate-[heartBurst_0.7s_ease-out]"
        >
          <svg width="90" height="90" viewBox="0 0 24 24" fill="#ff4d6d" aria-hidden="true">
            <path d="M12 21l-1.5-1.4C5 15 2 12.3 2 8.9 2 6.2 4.1 4 6.9 4c1.6 0 3.1.7 4.1 1.9C12 4.7 13.5 4 15.1 4 17.9 4 20 6.2 20 8.9c0 3.4-3 6.1-8.5 10.7z" />
          </svg>
        </span>
      )}

      <div className="pointer-events-none absolute top-0 right-0 left-0 z-[5] flex items-start justify-between gap-2.5 p-3.5">
        <div className="pointer-events-auto flex items-center gap-2.5">
          <Link
            href={reel.creatorId === currentUserId ? ROUTES.PROFILE : ROUTES.CREATOR_PROFILE(reel.creatorId)}
            aria-label={`View ${reel.creatorFullName}'s profile`}
            className="relative h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary-light to-primary p-0.5"
          >
            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
              {reel.creatorAvatarUrl ? (
                <Image src={reel.creatorAvatarUrl} alt="" fill sizes="42px" className="object-cover" />
              ) : (
                <User className="h-5 w-5 text-text-secondary/60" aria-hidden="true" />
              )}
            </span>
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link
                href={reel.creatorId === currentUserId ? ROUTES.PROFILE : ROUTES.CREATOR_PROFILE(reel.creatorId)}
                className="font-display text-[17px] font-semibold text-white [text-shadow:0_1px_6px_rgba(0,0,0,.5)] hover:text-primary-light"
              >
                {reel.creatorFullName}
              </Link>
              {reel.isCreator && (
                <span className="rounded-sm border border-secondary-light/40 bg-secondary/25 px-1.5 py-0.5 font-sans text-[8px] font-semibold tracking-wide text-secondary-light uppercase">
                  Creator
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 font-sans text-[11px] font-light text-white/80">
              <span>@{reel.creatorName}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleFollow}
            className={cn(
              "ml-1 rounded-md px-3.5 py-1.5 font-sans text-xs font-semibold transition",
              reel.followedByMe
                ? "border border-white/25 bg-white/10 text-white"
                : "bg-gradient-to-br from-primary-light to-primary text-[#03283a]",
            )}
          >
            {reel.followedByMe ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-[5] p-3.5">
        <div className="pointer-events-auto flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="min-w-8 font-sans text-[10.5px] text-white/85">{formatDuration(currentTime)}</span>
            <button
              type="button"
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const percentage = ((event.clientX - rect.left) / rect.width) * 100;
                seekTo(percentage);
              }}
              aria-label="Seek"
              className="relative h-[5px] flex-1 overflow-hidden rounded-full bg-white/20"
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-light to-primary"
                style={{ width: `${progress}%` }}
              />
            </button>
            <span className="min-w-8 font-sans text-[10.5px] text-white/60">{formatDuration(duration)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <PlayerControlButton onClick={togglePlay} label={playing ? "Pause" : "Play"}>
              {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            </PlayerControlButton>
            <PlayerControlButton onClick={toggleMute} label={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
            </PlayerControlButton>
            <input
              type="range"
              min={0}
              max={100}
              value={muted ? 0 : volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-label="Volume"
              className="w-[74px] accent-primary-light"
            />
            <div className="flex-1" />
            <button
              type="button"
              onClick={cycleSpeed}
              aria-label="Playback speed"
              className="flex h-8 items-center gap-1 rounded-md bg-white/14 px-2.5 font-sans text-[11.5px] font-semibold text-white transition hover:bg-white/24"
            >
              <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
              {speed}x
            </button>
            <PlayerControlButton onClick={handleFullscreen} label="Fullscreen">
              <Maximize className="h-4 w-4" aria-hidden="true" />
            </PlayerControlButton>
          </div>
        </div>
      </div>
    </div>
  );
});

function PlayerControlButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/14 text-white transition hover:bg-white/24"
    >
      {children}
    </button>
  );
}
