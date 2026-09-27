import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HomeFeedPost } from "@/features/home/components/HomeFeedPost";
import { HomeFeedSkeleton } from "@/features/home/components/HomeFeedSkeleton";
import { useHomeFeed } from "@/features/home/hooks/useHomeFeed";

export function HomeFeed() {
  const feed = useHomeFeed();
  const { sentinelRef } = feed;

  return (
    <div className="flex flex-col gap-4.5">
      {feed.status === "loading" && (
        <div className="flex flex-col gap-4.5">
          <HomeFeedSkeleton />
          <HomeFeedSkeleton />
        </div>
      )}

      {feed.status === "failed" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-danger/25 bg-danger/8 px-6 py-10 text-center">
          <AlertCircle className="h-8 w-8 text-danger" aria-hidden="true" />
          <p className="font-sans text-sm text-text-secondary">{feed.error}</p>
          <Button type="button" variant="secondary" onClick={feed.retry}>
            Try again
          </Button>
        </div>
      )}

      {feed.status === "succeeded" && feed.posts.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/12 bg-surface/40 px-6 py-14 text-center">
          <Inbox className="h-8 w-8 text-text-muted" aria-hidden="true" />
          <p className="font-sans text-sm text-text-secondary">No posts to show yet.</p>
        </div>
      )}

      {feed.status === "succeeded" && feed.posts.length > 0 && (
        <div className="flex flex-col gap-4.5">
          {feed.posts.map((post) => (
            <HomeFeedPost key={post.id} post={post} onToggleLike={feed.onToggleLike} />
          ))}

          <div ref={sentinelRef} className="h-px" />

          {feed.isLoadingMore && (
            <div className="flex items-center justify-center gap-2.5 py-2 font-sans text-[12.5px] font-light text-text-secondary/85">
              <Loader2 className="h-[18px] w-[18px] animate-spin text-primary-light" aria-hidden="true" />
              Loading more posts…
            </div>
          )}
          {!feed.hasMore && (
            <p className="py-2 text-center font-sans text-xs font-light text-text-muted">
              You&apos;re all caught up.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
