"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchReels, resetReels, toggleFollow, toggleLike, toggleSubscribe } from "@/store/slices/reelsSlice";

const WHEEL_COOLDOWN_MS = 650;
const WHEEL_THRESHOLD = 12;

export function useReelsFeed() {
  const dispatch = useAppDispatch();
  const reelsState = useAppSelector((state) => state.reels);
  const [index, setIndex] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const lastWheelRef = useRef(0);

  useEffect(() => {
    dispatch(resetReels());
    void dispatch(fetchReels({ page: 1, append: false }));
  }, [dispatch]);

  const reelCount = reelsState.reels.length;
  const safeIndex = reelCount > 0 ? Math.min(index, reelCount - 1) : 0;

  useEffect(() => {
    if (safeIndex >= reelCount - 3 && reelsState.hasMore && reelsState.status === "succeeded" && !reelsState.isLoadingMore) {
      void dispatch(fetchReels({ page: reelsState.page + 1, append: true }));
    }
  }, [safeIndex, reelCount, reelsState.hasMore, reelsState.status, reelsState.isLoadingMore, reelsState.page, dispatch]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (reelCount === 0) return;
      setIndex(((nextIndex % reelCount) + reelCount) % reelCount);
    },
    [reelCount],
  );

  const goNext = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex]);
  const goPrev = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (event.key === "ArrowUp") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        goNext();
      } else if (event.key === "Escape") {
        setCommentsOpen(false);
        setShareOpen(false);
        setReportOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (event: WheelEvent) => {
      if (commentsOpen || shareOpen || reportOpen) return;
      const now = Date.now();
      if (now - lastWheelRef.current < WHEEL_COOLDOWN_MS) {
        event.preventDefault();
        return;
      }
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;
      event.preventDefault();
      lastWheelRef.current = now;
      if (event.deltaY > 0) goNext();
      else goPrev();
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [commentsOpen, shareOpen, reportOpen, goNext, goPrev]);

  const currentReel = reelCount > 0 ? reelsState.reels[safeIndex] : null;
  const prevReel = reelCount > 1 ? reelsState.reels[(safeIndex - 1 + reelCount) % reelCount] : null;
  const nextReel = reelCount > 1 ? reelsState.reels[(safeIndex + 1) % reelCount] : null;

  return {
    reels: reelsState.reels,
    currentReel,
    prevReel,
    nextReel,
    status: reelsState.status,
    error: reelsState.error,
    stageRef,
    goNext,
    goPrev,
    goTo,
    commentsOpen,
    openComments: () => setCommentsOpen(true),
    closeComments: () => setCommentsOpen(false),
    shareOpen,
    openShare: () => setShareOpen(true),
    closeShare: () => setShareOpen(false),
    reportOpen,
    openReport: () => setReportOpen(true),
    closeReport: () => setReportOpen(false),
    retry: () => void dispatch(fetchReels({ page: 1, append: false })),
    onToggleLike: (reelId: string) => void dispatch(toggleLike(reelId)),
    onToggleFollow: (creatorId: string) => void dispatch(toggleFollow(creatorId)),
    onToggleSubscribe: (creatorId: string) => void dispatch(toggleSubscribe(creatorId)),
  };
}
