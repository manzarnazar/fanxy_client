"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStoryBundle, recordStoryView, resetStoryView } from "@/store/slices/storyViewSlice";
import { ROUTES } from "@/lib/constants/routes";

const HOLD_THRESHOLD_MS = 180;

export function useStoryViewer(username: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const state = useAppSelector((appState) => appState.storyView);

  useEffect(() => {
    void dispatch(fetchStoryBundle(username));
    return () => {
      dispatch(resetStoryView());
    };
  }, [dispatch, username]);

  const bundle = state.username === username ? state.bundle : null;
  const stories = bundle?.stories ?? [];
  const storyCount = stories.length;

  const [index, setIndex] = useState(0);
  const [trackedUsername, setTrackedUsername] = useState(username);
  if (trackedUsername !== username) {
    setTrackedUsername(username);
    setIndex(0);
  }

  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [muted, setMuted] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [kbdOpen, setKbdOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [followedByMe, setFollowedByMe] = useState(false);

  const safeIndex = storyCount > 0 ? Math.min(index, storyCount - 1) : 0;
  const currentStory = storyCount > 0 ? stories[safeIndex] : null;
  const panelsOpen = shareOpen || kbdOpen || reportOpen;
  const playing = !manuallyPaused && !panelsOpen && !holding;

  useEffect(() => {
    if (currentStory) void dispatch(recordStoryView(currentStory.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStory?.id]);

  const goPrevStory = useCallback(() => {
    setIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goNextStory = useCallback(() => {
    setIndex((prev) => (prev + 1 >= storyCount ? 0 : prev + 1));
  }, [storyCount]);

  const closeAllPanels = useCallback(() => {
    setShareOpen(false);
    setKbdOpen(false);
    setReportOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (event.key === "Escape") {
        closeAllPanels();
        return;
      }
      if (panelsOpen) return;

      if (event.key === "ArrowRight") goNextStory();
      else if (event.key === "ArrowLeft") goPrevStory();
      else if (event.key === " ") {
        event.preventDefault();
        setManuallyPaused((prev) => !prev);
      } else if (event.key === "m" || event.key === "M") {
        setMuted((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [panelsOpen, goNextStory, goPrevStory, closeAllPanels]);

  const createTapZoneHandlers = (navigate: () => void) => {
    const holdTimerRef = { current: null as number | null };
    const wasHoldingRef = { current: false };

    return {
      onPointerDown: () => {
        wasHoldingRef.current = false;
        holdTimerRef.current = window.setTimeout(() => {
          wasHoldingRef.current = true;
          setHolding(true);
        }, HOLD_THRESHOLD_MS);
      },
      onPointerUp: () => {
        if (holdTimerRef.current !== null) {
          clearTimeout(holdTimerRef.current);
          holdTimerRef.current = null;
        }
        if (wasHoldingRef.current) {
          setHolding(false);
          return;
        }
        navigate();
      },
      onPointerLeave: () => {
        if (holdTimerRef.current !== null) {
          clearTimeout(holdTimerRef.current);
          holdTimerRef.current = null;
        }
        if (wasHoldingRef.current) {
          setHolding(false);
          wasHoldingRef.current = false;
        }
      },
    };
  };

  const goToPrevCreator = () => {
    if (bundle?.prevCreator) router.push(ROUTES.STORY_VIEW(bundle.prevCreator.username));
  };
  const goToNextCreator = () => {
    if (bundle?.nextCreator) router.push(ROUTES.STORY_VIEW(bundle.nextCreator.username));
  };

  return {
    bundle,
    stories,
    status: state.username === username ? state.status : "loading",
    error: state.error,
    retry: () => void dispatch(fetchStoryBundle(username)),
    currentStory,
    storyIndex: safeIndex,
    storyCount,
    playing,
    togglePlay: () => setManuallyPaused((prev) => !prev),
    pause: () => setManuallyPaused(true),
    muted,
    toggleMute: () => setMuted((prev) => !prev),
    goNextStory,
    goPrevStory,
    createTapZoneHandlers,
    goToPrevCreator,
    goToNextCreator,
    shareOpen,
    openShare: () => setShareOpen(true),
    closeShare: () => setShareOpen(false),
    kbdOpen,
    toggleKbd: () => setKbdOpen((prev) => !prev),
    reportOpen,
    openReport: () => setReportOpen(true),
    closeReport: () => setReportOpen(false),
    followedByMe,
    onToggleFollow: () => setFollowedByMe((prev) => !prev),
  };
}
