import Image from "next/image";
import { CalendarClock, ImageOff, Images, Play, Trash2, X } from "lucide-react";
import { ScheduledCountdown } from "@/features/scheduled-posts/components/ScheduledCountdown";
import type { ScheduledPost } from "@/features/scheduled-posts/types/scheduled-posts.types";

interface ScheduledPreviewModalProps {
  post: ScheduledPost | null;
  onClose: () => void;
  onDelete: (post: ScheduledPost) => void;
}

export function ScheduledPreviewModal({ post, onClose, onDelete }: ScheduledPreviewModalProps) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Scheduled post preview"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[420px] overflow-hidden rounded-xl border border-primary/24 bg-surface-elevated shadow-dropdown"
      >
        <div className="relative aspect-[4/3] bg-surface">
          {post.thumbnailUrl ? (
            <Image src={post.thumbnailUrl} alt="" fill sizes="420px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-text-secondary/40">
              <ImageOff className="h-8 w-8" aria-hidden="true" />
            </span>
          )}
          {post.isVideo && (
            <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm">
              <Play className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-md bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <X className="h-[17px] w-[17px]" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5">
          <div className="font-display text-lg font-semibold text-text-primary">{post.title}</div>
          {post.description && (
            <p className="mt-1 line-clamp-3 font-sans text-[12.5px] leading-relaxed font-light text-text-secondary">
              {post.description}
            </p>
          )}

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-primary/18 bg-primary/8 px-2.5 py-1 font-sans text-[11px] font-medium text-text-secondary">
              <CalendarClock className="h-3.5 w-3.5 text-primary-light" aria-hidden="true" />
              {post.dateLabel} · {post.timeLabel}
            </span>
            {post.mediaCount > 1 && (
              <span className="flex items-center gap-1.5 rounded-full border border-primary/18 bg-primary/8 px-2.5 py-1 font-sans text-[11px] font-medium text-text-secondary">
                <Images className="h-3.5 w-3.5 text-primary-light" aria-hidden="true" />
                {post.mediaCount} media
              </span>
            )}
            <ScheduledCountdown targetMs={post.scheduledAtMs} />
          </div>

          <p className="mt-3.5 font-sans text-[11px] leading-relaxed font-light text-text-secondary/60">
            Publishes automatically at the scheduled time. The schedule can&apos;t be changed after creation — to adjust
            it, delete this post and create it again.
          </p>

          <button
            type="button"
            onClick={() => onDelete(post)}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md border border-danger/28 bg-danger/10 px-4 py-2.5 font-sans text-[13px] font-semibold text-danger transition hover:bg-danger/18"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete Scheduled Post
          </button>
        </div>
      </div>
    </div>
  );
}
