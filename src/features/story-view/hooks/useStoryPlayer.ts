"use client";

import { useEffect, useRef, useState } from "react";
import { STORY_DURATION_MS } from "@/features/story-view/constants/story-view";
import type { StoryItem } from "@/features/story-view/types/story-view.types";

interface UseStoryPlayerOptions {
  story: StoryItem;
  playing: boolean;
  muted: boolean;
  onComplete: () => void;
}

export function useStoryPlayer({ story, playing, muted, onComplete }: UseStoryPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const elapsedRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const isVideo = story.type === "video";

  const [progress, setProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(isVideo);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) void video.play().catch(() => setHasError(true));
    else video.pause();
  }, [playing]);

  useEffect(() => {
    if (isVideo) return;

    if (!playing) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      return;
    }

    startRef.current = performance.now() - elapsedRef.current;
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      elapsedRef.current = elapsed;
      const pct = Math.min(100, (elapsed / STORY_DURATION_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        onCompleteRef.current();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, isVideo]);

  return {
    videoRef,
    progress,
    isBuffering,
    hasError,
    videoHandlers: {
      onWaiting: () => setIsBuffering(true),
      onPlaying: () => setIsBuffering(false),
      onCanPlay: () => setIsBuffering(false),
      onError: () => setHasError(true),
      onEnded: () => onCompleteRef.current(),
      onTimeUpdate: (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = event.currentTarget;
        if (video.duration) setProgress((video.currentTime / video.duration) * 100);
      },
    },
  };
}
