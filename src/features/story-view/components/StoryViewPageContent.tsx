"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { reportStory } from "@/store/slices/storyViewSlice";
import { ReportModal } from "@/components/shared/ReportModal";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { useStoryViewer } from "@/features/story-view/hooks/useStoryViewer";
import { useReportReasons } from "@/hooks/useReportReasons";
import { REPORT_REASONS } from "@/features/story-view/constants/story-view";
import { StoryHeader } from "@/features/story-view/components/StoryHeader";
import { StoryCard } from "@/features/story-view/components/StoryCard";
import { StoryActionRail } from "@/features/story-view/components/StoryActionRail";
import { StoryNeighborPreview } from "@/features/story-view/components/StoryNeighborPreview";
import { StoryCreatorCard } from "@/features/story-view/components/StoryCreatorCard";
import { StoryShareModal } from "@/features/story-view/components/StoryShareModal";
import { StoryShortcutsModal } from "@/features/story-view/components/StoryShortcutsModal";

interface StoryViewPageContentProps {
  username: string;
}

export function StoryViewPageContent({ username }: StoryViewPageContentProps) {
  const dispatch = useAppDispatch();
  const reportReasons = useReportReasons(REPORT_REASONS);
  const viewer = useStoryViewer(username);
  const {
    bundle,
    status,
    error,
    retry,
    currentStory,
    storyIndex,
    storyCount,
    playing,
    togglePlay,
    muted,
    toggleMute,
    goNextStory,
    goPrevStory,
    createTapZoneHandlers,
    goToPrevCreator,
    goToNextCreator,
    shareOpen,
    openShare,
    closeShare,
    kbdOpen,
    toggleKbd,
    reportOpen,
    openReport,
    closeReport,
    followedByMe,
    onToggleFollow,
  } = viewer;

  if (status === "loading" && !bundle) {
    return (
      <div data-theme="dark" className="fixed inset-0 flex items-center justify-center bg-[#03080d]">
        <Loader2 className="h-9 w-9 animate-spin text-primary-light" aria-hidden="true" />
      </div>
    );
  }

  if (status === "failed" && !bundle) {
    return (
      <div data-theme="dark" className="fixed inset-0 flex items-center justify-center bg-[#03080d] p-6">
        <div className="w-full max-w-md">
          <SectionStateMessage
            variant="error"
            title="Couldn't load this story"
            body={error ?? "Something went wrong. Please try again."}
            onRetry={retry}
            minHeightClassName="min-h-0 py-16"
          />
        </div>
      </div>
    );
  }

  if (!bundle || !currentStory) {
    return (
      <div data-theme="dark" className="fixed inset-0 flex items-center justify-center bg-[#03080d] p-6">
        <div className="w-full max-w-md">
          <SectionStateMessage variant="empty" title="No stories" body="This creator hasn't posted any stories yet." />
        </div>
      </div>
    );
  }

  const { creator } = bundle;

  return (
    <div data-theme="dark" className="fixed inset-0 overflow-hidden bg-[#03080d]">
      <div className="absolute -inset-10 scale-110">
        <Image src={currentStory.url} alt="" fill className="object-cover opacity-40 blur-3xl" priority />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(900px_700px_at_50%_40%,rgba(3,16,26,.3),rgba(3,8,13,.88))]" />

      <StoryHeader
        creator={creator}
        createdAt={currentStory.createdAt}
        storyPosition={storyIndex + 1}
        storyTotal={storyCount}
        playing={playing}
        onTogglePlay={togglePlay}
        muted={muted}
        onToggleMute={toggleMute}
        onToggleShortcuts={toggleKbd}
      />

      <div className="absolute inset-0 z-20 flex items-center justify-center gap-6 px-10">
        {bundle.prevCreator && <StoryNeighborPreview neighbor={bundle.prevCreator} direction="prev" onClick={goToPrevCreator} />}

        <StoryCard
          story={currentStory}
          storyIndex={storyIndex}
          storyCount={storyCount}
          playing={playing}
          muted={muted}
          onComplete={goNextStory}
          prevZoneHandlers={createTapZoneHandlers(goPrevStory)}
          nextZoneHandlers={createTapZoneHandlers(goNextStory)}
        />

        <div className="relative hidden md:block">
          <StoryActionRail onShare={openShare} onReport={openReport} />
        </div>

        {bundle.nextCreator && <StoryNeighborPreview neighbor={bundle.nextCreator} direction="next" onClick={goToNextCreator} />}
      </div>

      <div className="fixed right-2.5 bottom-24 z-30 md:hidden">
        <StoryActionRail onShare={openShare} onReport={openReport} />
      </div>

      <StoryCreatorCard creator={creator} followedByMe={followedByMe} onToggleFollow={onToggleFollow} />

      <StoryShareModal story={currentStory} username={username} open={shareOpen} onClose={closeShare} />
      <StoryShortcutsModal open={kbdOpen} onClose={toggleKbd} />
      <ReportModal
        title="Report story"
        reasons={reportReasons}
        open={reportOpen}
        onClose={closeReport}
        onSubmit={(reason) =>
          dispatch(reportStory({ storyId: currentStory.id, reportUserId: creator.id, reason }))
            .unwrap()
            .then(() => undefined)
        }
      />
    </div>
  );
}
