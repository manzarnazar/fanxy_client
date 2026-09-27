"use client";

import Image from "next/image";
import { Copy, Eye, Loader2, Lock, Play } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import type { CreatorProfilePost } from "@/features/creator-profile/types/creator-profile.types";

interface CreatorProfilePostsGridProps {
  posts: CreatorProfilePost[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onRetry: () => void;
  onOpenPost: (post: CreatorProfilePost) => void;
  onUnlock: () => void;
}

function PostTile({
  post,
  onOpenPost,
  onUnlock,
}: {
  post: CreatorProfilePost;
  onOpenPost: (post: CreatorProfilePost) => void;
  onUnlock: () => void;
}) {
  const cover = post.media.find((item) => item.thumbnailUrl)?.thumbnailUrl ?? null;
  const hasVideo = post.media.some((item) => item.type === "video");

  if (post.locked) {
    return (
      <button
        type="button"
        onClick={onUnlock}
        aria-label="Locked post — subscribe to unlock"
        className="group relative aspect-square overflow-hidden rounded-lg border border-primary/13 bg-surface"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-surface to-surface" />
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 bg-surface-elevated/80 transition-transform group-hover:scale-110">
            <Lock className="h-4.5 w-4.5 text-primary-light" aria-hidden="true" />
          </span>
          <span className="font-sans text-[10.5px] font-light text-text-muted">Subscribers only</span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpenPost(post)}
      aria-label={post.title ?? "View post"}
      className="group relative aspect-square overflow-hidden rounded-lg border border-primary/13 bg-surface"
    >
      {cover ? (
        <Image
          src={cover}
          alt=""
          fill
          sizes="(max-width: 640px) 33vw, 240px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-surface">
          <Eye className="h-5 w-5 text-text-muted" aria-hidden="true" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />

      <div className="absolute right-1.5 bottom-1.5 left-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1 font-sans text-[10.5px] font-medium text-white">
          <Eye className="h-3 w-3" aria-hidden="true" />
          {formatCount(post.viewCount)}
        </span>
        {hasVideo && <Play className="h-3.5 w-3.5 fill-white text-white" aria-hidden="true" />}
      </div>

      {post.media.length > 1 && (
        <Copy className="absolute top-2 right-2 h-3.5 w-3.5 text-white drop-shadow" aria-hidden="true" />
      )}
    </button>
  );
}

export function CreatorProfilePostsGrid({
  posts,
  status,
  error,
  hasMore,
  sentinelRef,
  onRetry,
  onOpenPost,
  onUnlock,
}: CreatorProfilePostsGridProps) {
  if (status === "loading" && posts.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-2" role="status" aria-label="Loading posts">
        {Array.from({ length: 9 }, (_, index) => (
          <div key={index} className="aspect-square animate-pulse rounded-lg bg-surface" />
        ))}
      </div>
    );
  }

  if (status === "failed" && posts.length === 0) {
    return (
      <SectionStateMessage
        variant="error"
        title="Couldn't load posts"
        body={error ?? "Something went wrong. Please try again."}
        onRetry={onRetry}
        minHeightClassName="min-h-[240px]"
      />
    );
  }

  if (posts.length === 0) {
    return (
      <SectionStateMessage
        variant="empty"
        title="No posts yet"
        body="This creator hasn't shared anything yet."
        minHeightClassName="min-h-[240px]"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <PostTile key={post.id} post={post} onOpenPost={onOpenPost} onUnlock={onUnlock} />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center gap-2.5 py-4">
          <Loader2 className="h-4 w-4 animate-spin text-primary-light" aria-hidden="true" />
          <span className="font-sans text-[12.5px] font-light text-text-secondary/70">Loading more posts…</span>
        </div>
      )}
    </>
  );
}
