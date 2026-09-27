"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Keyboard, Pause, Play, User, Volume2, VolumeX, X } from "lucide-react";
import { formatRelativeTime } from "@/lib/formatter/relativeTime";
import { ROUTES } from "@/lib/constants/routes";
import type { StoryCreator } from "@/features/story-view/types/story-view.types";

interface StoryHeaderProps {
  creator: StoryCreator;
  createdAt: string;
  storyPosition: number;
  storyTotal: number;
  playing: boolean;
  onTogglePlay: () => void;
  muted: boolean;
  onToggleMute: () => void;
  onToggleShortcuts: () => void;
}

export function StoryHeader({
  creator,
  createdAt,
  storyPosition,
  storyTotal,
  playing,
  onTogglePlay,
  muted,
  onToggleMute,
  onToggleShortcuts,
}: StoryHeaderProps) {
  const router = useRouter();

  return (
    <div className="absolute top-0 right-0 left-0 z-40 flex items-center gap-3.5 bg-gradient-to-b from-black/70 to-transparent px-6.5 py-4.5">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-white/14 bg-surface-elevated/50 text-white backdrop-blur-md transition hover:bg-primary/14"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <Link
        href={ROUTES.CREATOR_PROFILE(creator.id)}
        aria-label={`View ${creator.name}'s profile`}
        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary-light to-primary p-0.5"
      >
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
          {creator.avatarUrl ? (
            <Image src={creator.avatarUrl} alt="" fill sizes="44px" className="object-cover" />
          ) : (
            <User className="h-5 w-5 text-text-secondary/60" aria-hidden="true" />
          )}
        </span>
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Link
            href={ROUTES.CREATOR_PROFILE(creator.id)}
            className="font-display text-lg font-semibold text-white hover:text-primary-light"
          >
            {creator.name}
          </Link>
        </div>
        <div className="mt-0.5 font-sans text-[11.5px] font-light text-white/70">
          {formatRelativeTime(createdAt)} · Story {storyPosition} of {storyTotal}
        </div>
      </div>

      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={playing ? "Pause story" : "Play story"}
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-white/14 bg-surface-elevated/50 text-white backdrop-blur-md transition hover:bg-primary/14"
      >
        {playing ? <Pause className="h-[19px] w-[19px]" aria-hidden="true" /> : <Play className="h-[19px] w-[19px]" aria-hidden="true" />}
      </button>
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-white/14 bg-surface-elevated/50 text-white backdrop-blur-md transition hover:bg-primary/14"
      >
        {muted ? <VolumeX className="h-[19px] w-[19px]" aria-hidden="true" /> : <Volume2 className="h-[19px] w-[19px]" aria-hidden="true" />}
      </button>
      <button
        type="button"
        onClick={onToggleShortcuts}
        aria-label="Keyboard shortcuts"
        className="hidden h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-white/14 bg-surface-elevated/50 text-white backdrop-blur-md transition hover:bg-primary/14 sm:flex"
      >
        <Keyboard className="h-5 w-5" aria-hidden="true" />
      </button>
      <Link
        href={ROUTES.HOME}
        aria-label="Close"
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-white/14 bg-surface-elevated/50 text-white backdrop-blur-md transition hover:bg-live/20"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </Link>
    </div>
  );
}
