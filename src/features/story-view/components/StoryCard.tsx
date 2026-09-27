"use client";

import Image from "next/image";
import { Loader2, Pause, Play } from "lucide-react";
import { useStoryPlayer } from "@/features/story-view/hooks/useStoryPlayer";
import { StoryProgressBars } from "@/features/story-view/components/StoryProgressBars";
import { StoryCaption } from "@/features/story-view/components/StoryCaption";
import type { StoryItem } from "@/features/story-view/types/story-view.types";

interface TapZoneHandlers {
  onPointerDown: () => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
}

interface StoryCardProps {
  story: StoryItem;
  storyIndex: number;
  storyCount: number;
  playing: boolean;
  muted: boolean;
  onComplete: () => void;
  prevZoneHandlers: TapZoneHandlers;
  nextZoneHandlers: TapZoneHandlers;
}

export function StoryCard({ story, storyIndex, storyCount, playing, muted, onComplete, prevZoneHandlers, nextZoneHandlers }: StoryCardProps) {
  const { videoRef, progress, isBuffering, hasError, videoHandlers } = useStoryPlayer({
    story,
    playing,
    muted,
    onComplete,
  });

  return (
    <div className="relative aspect-[9/16] w-full max-w-[412px] overflow-hidden rounded-[26px] border border-primary/14 bg-surface-elevated shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]">
      {story.type === "video" ? (
        <video ref={videoRef} src={story.url} className="absolute inset-0 h-full w-full object-cover" playsInline {...videoHandlers} />
      ) : (
        <Image src={story.url} alt="" fill sizes="412px" className="object-cover" priority />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 from-0% via-transparent via-20% to-black/88" />

      <StoryProgressBars count={storyCount} activeIndex={storyIndex} activeProgress={progress} />

      <div className="absolute top-[60px] bottom-[120px] left-0 z-[5] w-[32%]" {...prevZoneHandlers} />
      <div className="absolute top-[60px] right-0 bottom-[120px] z-[5] w-[32%]" {...nextZoneHandlers} />

      {isBuffering && !hasError && (
        <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-white/80" aria-hidden="true" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 z-[6] flex items-center justify-center bg-surface-elevated px-6 text-center">
          <p className="font-sans text-sm text-text-secondary">This story couldn&apos;t be played.</p>
        </div>
      )}

      {!playing && !isBuffering && !hasError && (
        <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-surface-elevated/40 text-white backdrop-blur-sm">
            {story.type === "video" ? <Pause className="h-7 w-7" aria-hidden="true" /> : <Play className="h-7 w-7" aria-hidden="true" />}
          </span>
        </div>
      )}

      <StoryCaption story={story} />
    </div>
  );
}
