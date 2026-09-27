"use client";

import { useEffect, useRef } from "react";
import { useReelsFeed } from "@/features/reels/hooks/useReelsFeed";
import { ReelPlayer, type ReelPlayerHandle } from "@/features/reels/components/ReelPlayer";
import { ReelPeekCard } from "@/features/reels/components/ReelPeekCard";
import { ReelActionBar } from "@/features/reels/components/ReelActionBar";
import { ReelInfoPanel } from "@/features/reels/components/ReelInfoPanel";
import { ReelRelatedCard } from "@/features/reels/components/ReelRelatedCard";
import { ReelsRightSidebar } from "@/features/reels/components/ReelsRightSidebar";
import { ReelsFeedSkeleton } from "@/features/reels/components/ReelsFeedSkeleton";
import { ReelsStateMessage } from "@/features/reels/components/ReelsStateMessage";
import { PostCommentsModal } from "@/features/post-comments/components/PostCommentsModal";
import { ReelShareModal } from "@/features/reels/components/ReelShareModal";
import { ReelReportModal } from "@/features/reels/components/ReelReportModal";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export function ReelsPageContent() {
  const { requireAuth } = useAuthGuard();
  const feed = useReelsFeed();
  const {
    reels,
    currentReel,
    prevReel,
    nextReel,
    status,
    error,
    stageRef,
    goNext,
    goPrev,
    goTo,
    commentsOpen,
    openComments,
    closeComments,
    shareOpen,
    openShare,
    closeShare,
    reportOpen,
    openReport,
    closeReport,
    retry,
    onToggleLike,
    onToggleFollow,
    onToggleSubscribe,
  } = feed;
  const playerRef = useRef<ReelPlayerHandle>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (event.key === " ") {
        event.preventDefault();
        playerRef.current?.togglePlay();
      } else if (event.key === "m" || event.key === "M") {
        playerRef.current?.toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const relatedReels = currentReel ? reels.filter((reel) => reel.id !== currentReel.id) : [];

  return (
    <>
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 gap-7 px-6.5 lg:px-10">
        <main className="min-w-0 flex-1 overflow-y-auto py-5.5 pb-[100px] lg:pb-5.5">
          <div className="mx-auto max-w-[720px]">
            {status === "loading" && !currentReel && <ReelsFeedSkeleton />}

            {status === "failed" && !currentReel && (
              <ReelsStateMessage
                variant="error"
                title="Something went wrong"
                body={error ?? "We couldn't load reels right now. Please try again."}
                onRetry={retry}
              />
            )}

            {status === "succeeded" && !currentReel && (
              <ReelsStateMessage variant="empty" title="No reels yet" body="Check back soon for new video content." />
            )}

            {currentReel && (
              <>
                <div ref={stageRef} className="flex flex-col items-center gap-3">
                  {prevReel && <ReelPeekCard reel={prevReel} direction="prev" onClick={goPrev} />}

                  <div className="flex w-full max-w-[378px] flex-col items-center gap-4 sm:w-auto sm:max-w-none sm:flex-row sm:items-end">
                    <ReelPlayer
                      key={currentReel.id}
                      ref={playerRef}
                      reel={currentReel}
                      isActive
                      isFollowPending={false}
                      onToggleFollow={() => onToggleFollow(currentReel.creatorId)}
                      onToggleLike={() => requireAuth(() => onToggleLike(currentReel.id), "Sign in to like reels.")}
                    />
                    <ReelActionBar
                      reel={currentReel}
                      onToggleLike={() => requireAuth(() => onToggleLike(currentReel.id), "Sign in to like reels.")}
                      onOpenComments={() => requireAuth(openComments, "Sign in to view and add comments.")}
                      onOpenShare={openShare}
                      onToggleSubscribe={() => onToggleSubscribe(currentReel.creatorId)}
                      onOpenReport={openReport}
                    />
                  </div>

                  {nextReel && <ReelPeekCard reel={nextReel} direction="next" onClick={goNext} />}
                </div>

                <ReelInfoPanel reel={currentReel} />

                {relatedReels.length > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-4 font-display text-xl font-semibold text-text-primary">More reels like this</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {relatedReels.map((reel) => (
                        <ReelRelatedCard
                          key={reel.id}
                          reel={reel}
                          onClick={() => goTo(reels.findIndex((item) => item.id === reel.id))}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {currentReel && (
          <ReelsRightSidebar
            currentReel={currentReel}
            reels={reels}
            onSelectReel={(reelId) => goTo(reels.findIndex((item) => item.id === reelId))}
            onToggleSubscribe={onToggleSubscribe}
            onToggleFollow={onToggleFollow}
          />
        )}
      </div>

      {currentReel && (
        <>
          <PostCommentsModal postId={currentReel.id} commentCount={currentReel.commentCount} open={commentsOpen} onClose={closeComments} />
          <ReelShareModal reel={currentReel} open={shareOpen} onClose={closeShare} />
          <ReelReportModal reelId={currentReel.id} open={reportOpen} onClose={closeReport} />
        </>
      )}
    </>
  );
}
