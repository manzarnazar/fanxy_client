import Image from "next/image";
import { CalendarClock, Eye, ImageOff, Images, Play, Trash2 } from "lucide-react";
import { ScheduledCountdown } from "@/features/scheduled-posts/components/ScheduledCountdown";
import type { ScheduledPost } from "@/features/scheduled-posts/types/scheduled-posts.types";

interface ScheduledPostRowProps {
  post: ScheduledPost;
  onPreview: () => void;
  onDelete: () => void;
  onExpired: () => void;
}

export function ScheduledPostRow({ post, onPreview, onDelete, onExpired }: ScheduledPostRowProps) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-primary/14 bg-surface/50 p-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-elevated">
        {post.thumbnailUrl ? (
          <Image src={post.thumbnailUrl} alt="" fill sizes="64px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-text-secondary/40">
            <ImageOff className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        {post.isVideo && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
            <Play className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-sans text-[13.5px] font-semibold text-text-primary">{post.title}</span>
          <span className="shrink-0 rounded-sm bg-primary/12 px-1.5 py-0.5 font-sans text-[8.5px] font-bold tracking-wide text-primary-light uppercase">
            {post.isVideo ? "Reel" : "Post"}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[11.5px] font-light text-text-secondary/70">
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
            {post.dateLabel} · {post.timeLabel}
          </span>
          {post.mediaCount > 1 && (
            <span className="flex items-center gap-1">
              <Images className="h-3.5 w-3.5" aria-hidden="true" />
              {post.mediaCount} media
            </span>
          )}
          <ScheduledCountdown targetMs={post.scheduledAtMs} onExpired={onExpired} />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          title="Preview"
          onClick={onPreview}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-primary-light transition hover:bg-primary/12"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          title="Delete"
          onClick={onDelete}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-danger/24 bg-danger/8 text-danger transition hover:bg-danger/16"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
