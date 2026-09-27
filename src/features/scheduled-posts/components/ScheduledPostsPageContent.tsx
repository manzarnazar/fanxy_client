"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useScheduledPosts } from "@/features/scheduled-posts/hooks/useScheduledPosts";
import { ScheduledHeaderBar } from "@/features/scheduled-posts/components/ScheduledHeaderBar";
import { ScheduledKpiRow } from "@/features/scheduled-posts/components/ScheduledKpiRow";
import { ScheduledToolbar } from "@/features/scheduled-posts/components/ScheduledToolbar";
import { ScheduledCalendar } from "@/features/scheduled-posts/components/ScheduledCalendar";
import { ScheduledPostRow } from "@/features/scheduled-posts/components/ScheduledPostRow";
import { ScheduledRightRail } from "@/features/scheduled-posts/components/ScheduledRightRail";
import { ScheduledPreviewModal } from "@/features/scheduled-posts/components/ScheduledPreviewModal";
import { ScheduledDeleteModal } from "@/features/scheduled-posts/components/ScheduledDeleteModal";
import { ScheduledSkeleton } from "@/features/scheduled-posts/components/ScheduledSkeleton";
import type { ScheduledPost } from "@/features/scheduled-posts/types/scheduled-posts.types";

export function ScheduledPostsPageContent() {
  const router = useRouter();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const isCreator = user?.role === "creator";

  const feed = useScheduledPosts();
  const [previewPost, setPreviewPost] = useState<ScheduledPost | null>(null);
  const [deletePost, setDeletePost] = useState<ScheduledPost | null>(null);

  useEffect(() => {
    if (isBootstrapped && !isCreator) {
      router.replace(ROUTES.HOME);
    }
  }, [isBootstrapped, isCreator, router]);

  if (!isBootstrapped || !isCreator) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  const isLoading = feed.status === "loading" || feed.status === "idle";

  const handleConfirmDelete = async (post: ScheduledPost) => {
    const deleted = await feed.remove(post.id);
    if (deleted) {
      setDeletePost(null);
      setPreviewPost(null);
    }
  };

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto flex max-w-[1180px] gap-5">
        <div className="min-w-0 flex-1">
          <ScheduledHeaderBar refreshing={isLoading} onRefresh={feed.refresh} />

          {isLoading ? (
            <ScheduledSkeleton />
          ) : feed.status === "failed" ? (
            <SectionStateMessage
              variant="error"
              title="Unable to load schedule"
              body={feed.error ?? "Something went wrong while loading your scheduled posts."}
              onRetry={feed.refresh}
            />
          ) : !feed.hasAny ? (
            <SectionStateMessage
              variant="empty"
              icon={CalendarClock}
              title="No scheduled posts"
              body="Schedule a post while uploading and it will publish itself right on time."
              emptyHref={ROUTES.MY_CONTENT}
              emptyLabel="Schedule Your First Post"
            />
          ) : (
            <>
              <ScheduledKpiRow
                total={feed.counts.total}
                today={feed.counts.today}
                week={feed.counts.week}
                month={feed.counts.month}
              />
              <ScheduledToolbar
                viewMode={feed.viewMode}
                onViewModeChange={feed.setViewMode}
                typeFilter={feed.typeFilter}
                onTypeFilterChange={feed.setTypeFilter}
                rangeFilter={feed.rangeFilter}
                onRangeFilterChange={feed.setRangeFilter}
              />

              {feed.viewMode === "calendar" ? (
                <ScheduledCalendar posts={feed.filtered} onSelectPost={setPreviewPost} />
              ) : feed.filtered.length === 0 ? (
                <SectionStateMessage
                  variant="empty"
                  icon={CalendarClock}
                  title="Nothing here"
                  body="No scheduled posts match the selected filters."
                  minHeightClassName="min-h-[260px]"
                />
              ) : (
                <div className="flex flex-col gap-2.5">
                  {feed.filtered.map((post) => (
                    <ScheduledPostRow
                      key={post.id}
                      post={post}
                      onPreview={() => setPreviewPost(post)}
                      onDelete={() => setDeletePost(post)}
                      onExpired={feed.refresh}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {!isLoading && feed.hasAny && (
          <ScheduledRightRail
            todaysPosts={feed.todaysPosts}
            upNext={feed.upNext}
            onSelectPost={setPreviewPost}
            onExpired={feed.refresh}
          />
        )}
      </div>

      <ScheduledPreviewModal post={previewPost} onClose={() => setPreviewPost(null)} onDelete={setDeletePost} />
      <ScheduledDeleteModal
        post={deletePost}
        deleting={feed.deletingId !== null}
        onCancel={() => setDeletePost(null)}
        onConfirm={(post) => void handleConfirmDelete(post)}
      />
    </main>
  );
}
