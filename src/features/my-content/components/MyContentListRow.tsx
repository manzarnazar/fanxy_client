import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { Eye, Heart, ImageOff, MessageCircle, Play } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";
import { MyContentContextMenu } from "@/features/my-content/components/MyContentContextMenu";
import type { ContentItem, ContentViewMode } from "@/features/my-content/types/my-content.types";

interface MyContentListRowProps {
  item: ContentItem;
  viewMode: Extract<ContentViewMode, "list" | "compact">;
  onPreview: () => void;
  onDelete: () => void;
}

export function MyContentListRow({ item, viewMode, onPreview, onDelete }: MyContentListRowProps) {
  const isCompact = viewMode === "compact";
  const thumbSize = isCompact ? 44 : 64;

  return (
    <div className={cn("flex items-center rounded-xl border border-primary/14 bg-surface/50 transition hover:border-primary/30", isCompact ? "gap-2 px-2.5 py-1.5" : "gap-3 px-3 py-2.5")}>
      <div className="relative shrink-0 overflow-hidden rounded-md bg-surface-elevated" style={{ width: thumbSize, height: thumbSize }}>
        {item.thumbnailUrl ? (
          <Image src={item.thumbnailUrl} alt="" fill className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-text-secondary/40">
            <ImageOff className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        {item.mediaType === "video" && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Play className="h-3.5 w-3.5 text-white" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-sans text-[13px] font-medium text-text-primary">{item.title || item.description || "Untitled"}</span>
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 font-sans text-[8.5px] font-semibold",
              item.scheduled ? "bg-primary/16 text-primary-light" : "bg-success/16 text-success",
            )}
          >
            <span className={cn("h-1 w-1 rounded-full", item.scheduled ? "bg-primary-light" : "bg-success")} aria-hidden="true" />
            {item.scheduled ? "Scheduled" : "Published"}
          </span>
        </div>
        {!isCompact && item.description && <div className="mt-0.5 truncate font-sans text-[11.5px] font-light text-text-secondary/65">{item.description}</div>}
        <div className="mt-0.5 font-sans text-[10.5px] font-light text-text-secondary/55">{item.dateLabel}</div>
      </div>

      {item.kind === "post" && (
        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <span className="flex items-center gap-1 font-sans text-[11px] font-light text-text-secondary/65">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            {formatCount(item.viewCount)}
          </span>
          <span className="flex items-center gap-1 font-sans text-[11px] font-light text-text-secondary/65">
            <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            {formatCount(item.likeCount ?? 0)}
          </span>
          <span className="flex items-center gap-1 font-sans text-[11px] font-light text-text-secondary/65">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {formatCount(item.commentCount ?? 0)}
          </span>
        </div>
      )}

      <MyContentContextMenu onPreview={onPreview} onDelete={onDelete} />
    </div>
  );
}
