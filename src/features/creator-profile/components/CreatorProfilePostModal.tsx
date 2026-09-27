"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, Heart, MessageCircle, X } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";
import { formatRelativeTime } from "@/lib/formatter/relativeTime";
import type { CreatorProfilePost } from "@/features/creator-profile/types/creator-profile.types";

interface CreatorProfilePostModalProps {
  post: CreatorProfilePost;
  creatorName: string;
  onClose: () => void;
}

export function CreatorProfilePostModal({ post, creatorName, onClose }: CreatorProfilePostModalProps) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const media = post.media[mediaIndex];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") setMediaIndex((index) => Math.max(0, index - 1));
      if (event.key === "ArrowRight") setMediaIndex((index) => Math.min(post.media.length - 1, index + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, post.media.length]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={post.title ?? `Post by ${creatorName}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-primary/16 bg-surface-elevated shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-primary/10 px-4 py-3">
          <span className="font-sans text-[13px] font-semibold text-text-primary">{creatorName}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-primary/10 hover:text-text-primary"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative aspect-square w-full bg-black">
          {media?.type === "video" && media.url ? (
            <video
              key={media.id}
              src={media.url}
              poster={media.thumbnailUrl ?? undefined}
              controls
              playsInline
              className="h-full w-full object-contain"
            />
          ) : media?.thumbnailUrl ? (
            <Image key={media.id} src={media.thumbnailUrl} alt="" fill sizes="560px" className="object-contain" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-sans text-[12.5px] text-text-muted">
              Media unavailable
            </div>
          )}

          {post.media.length > 1 && (
            <>
              {mediaIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setMediaIndex((index) => index - 1)}
                  aria-label="Previous media"
                  className="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              {mediaIndex < post.media.length - 1 && (
                <button
                  type="button"
                  onClick={() => setMediaIndex((index) => index + 1)}
                  aria-label="Next media"
                  className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              <span className="absolute top-3 right-3 rounded-full bg-black/55 px-2.5 py-1 font-sans text-[10.5px] font-medium text-white">
                {mediaIndex + 1}/{post.media.length}
              </span>
            </>
          )}
        </div>

        <div className="px-4 py-3.5">
          <div className="flex items-center gap-4 font-sans text-[12.5px] text-text-secondary">
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" aria-hidden="true" />
              {formatCount(post.likeCount)}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {formatCount(post.commentCount)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" aria-hidden="true" />
              {formatCount(post.viewCount)}
            </span>
            <span className="ml-auto font-light text-text-muted">{formatRelativeTime(post.createdAt)}</span>
          </div>

          {(post.title || post.description) && (
            <div className="mt-2.5">
              {post.title && <h2 className="font-sans text-[14px] font-semibold text-text-primary">{post.title}</h2>}
              {post.description && (
                <p className="mt-1 font-sans text-[13px] leading-relaxed font-light whitespace-pre-line text-text-secondary">
                  {post.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
