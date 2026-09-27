"use client";

import { useEffect, useRef, useState } from "react";
import { PLAYBACK_SPEEDS } from "@/features/reels/constants/reels";

interface UseReelPlayerOptions {
  autoPlay: boolean;
}

export function useReelPlayer({ autoPlay }: UseReelPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userPausedRef = useRef(false);

  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showBigPlay, setShowBigPlay] = useState(false);

  const speed = PLAYBACK_SPEEDS[speedIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume / 100;
    video.muted = muted;
    video.playbackRate = speed;
  }, [volume, muted, speed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;
    video.play().catch(() => setHasError(true));
  }, [autoPlay]);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!userPausedRef.current) void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      void video.play().catch(() => setHasError(true));
    } else {
      userPausedRef.current = true;
      video.pause();
    }
    setShowBigPlay(true);
    window.setTimeout(() => setShowBigPlay(false), 500);
  };

  const toggleMute = () => setMuted((prev) => !prev);
  const setVolumeLevel = (value: number) => {
    setVolume(value);
    if (value > 0 && muted) setMuted(false);
  };
  const cycleSpeed = () => setSpeedIndex((prev) => (prev + 1) % PLAYBACK_SPEEDS.length);

  const seekTo = (percentage: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = (percentage / 100) * duration;
  };

  return {
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
    showBigPlay,
    togglePlay,
    toggleMute,
    setVolume: setVolumeLevel,
    cycleSpeed,
    seekTo,
    videoHandlers: {
      onPlay: () => setPlaying(true),
      onPause: () => setPlaying(false),
      onWaiting: () => setIsBuffering(true),
      onPlaying: () => setIsBuffering(false),
      onCanPlay: () => setIsBuffering(false),
      onLoadedMetadata: (event: React.SyntheticEvent<HTMLVideoElement>) => {
        setDuration(event.currentTarget.duration);
      },
      onTimeUpdate: (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = event.currentTarget;
        setCurrentTime(video.currentTime);
        setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
      },
      onError: () => setHasError(true),
    },
  };
}
