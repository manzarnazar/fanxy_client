import { AlertTriangle, Loader2 } from "lucide-react";
import type { ScheduledPost } from "@/features/scheduled-posts/types/scheduled-posts.types";

interface ScheduledDeleteModalProps {
  post: ScheduledPost | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: (post: ScheduledPost) => void;
}

export function ScheduledDeleteModal({ post, deleting, onCancel, onConfirm }: ScheduledDeleteModalProps) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[96] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Delete scheduled post"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[400px] rounded-xl border border-danger/30 bg-surface-elevated p-6 shadow-dropdown"
      >
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/12 text-danger">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="font-display text-lg font-semibold text-text-primary">Delete this scheduled post?</div>
        <p className="mt-1.5 font-sans text-[12.5px] leading-relaxed font-light text-text-secondary">
          &ldquo;{post.title}&rdquo; is scheduled for {post.dateLabel} at {post.timeLabel}. Deleting removes the post
          and its media permanently — it will never publish.
        </p>

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 rounded-md border border-primary/18 bg-surface/60 px-4 py-2.5 font-sans text-[13px] font-medium text-text-secondary transition hover:bg-primary/10 disabled:opacity-60"
          >
            Keep Post
          </button>
          <button
            type="button"
            onClick={() => onConfirm(post)}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-danger px-4 py-2.5 font-sans text-[13px] font-semibold text-white transition hover:bg-danger-strong disabled:opacity-60"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
