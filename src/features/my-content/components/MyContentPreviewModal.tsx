"use client";

import { useEffect } from "react";
import Image from "next/image";
import { CalendarClock, Eye, Heart, ImageOff, MessageCircle, X } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";
import type { ContentItem } from "@/features/my-content/types/my-content.types";

interface MyContentPreviewModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

export function MyContentPreviewModal({ item, onClose }: MyContentPreviewModalProps) {
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[4px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.title ?? "Preview"}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-hidden rounded-2xl border border-primary/22 bg-surface-elevated shadow-card"
      >
        <div className="flex items-center gap-2.5 border-b border-primary/10 px-4 py-3">
          <span className="rounded-md border border-primary/25 bg-primary/10 px-2 py-1 font-sans text-[9px] font-semibold tracking-wide text-primary-light uppercase">
            {item.kind === "story" ? "Story" : "Post"}
          </span>
          <span className="min-w-0 flex-1 truncate font-sans text-[14px] font-semibold text-text-primary">
            {item.title ?? "Untitled"}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-primary/10 hover:text-text-primary"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative aspect-square w-full shrink-0 bg-black">
          {item.mediaType === "video" && item.mediaUrl ? (
            <video
              src={item.mediaUrl}
              poster={item.thumbnailUrl ?? undefined}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          ) : item.thumbnailUrl ? (
            <Image src={item.thumbnailUrl} alt="" fill sizes="480px" className="object-contain" />
          ) : (
            <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-secondary/40">
              <ImageOff className="h-8 w-8" aria-hidden="true" />
              <span className="font-sans text-[12px] font-light">Media unavailable</span>
            </span>
          )}
        </div>

        <div className="overflow-y-auto px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {item.kind === "post" && (
              <>
                <span className="flex items-center gap-1.5 font-sans text-[12.5px] text-text-secondary">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  {formatCount(item.viewCount)}
                </span>
                <span className="flex items-center gap-1.5 font-sans text-[12.5px] text-text-secondary">
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  {formatCount(item.likeCount ?? 0)}
                </span>
                <span className="flex items-center gap-1.5 font-sans text-[12.5px] text-text-secondary">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {formatCount(item.commentCount ?? 0)}
                </span>
              </>
            )}
            <span className="ml-auto font-sans text-[11.5px] font-light text-text-muted">{item.dateLabel}</span>
          </div>

          {item.scheduled && item.scheduleLabel && (
            <div className="mt-2.5 flex items-center gap-1.5 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 font-sans text-[11.5px] font-medium text-warning">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              Scheduled · {item.scheduleLabel}
            </div>
          )}

          {item.description && (
            <p className="mt-2.5 font-sans text-[13px] leading-relaxed font-light whitespace-pre-line text-text-secondary">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
