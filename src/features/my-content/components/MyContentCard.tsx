import Image from "next/image";
import { Eye, Heart, ImageOff, MessageCircle, Play } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { MyContentContextMenu } from "@/features/my-content/components/MyContentContextMenu";
import type { ContentItem } from "@/features/my-content/types/my-content.types";

interface MyContentCardProps {
  item: ContentItem;
  onPreview: () => void;
  onDelete: () => void;
}

export function MyContentCard({ item, onPreview, onDelete }: MyContentCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/14 bg-surface/50 transition hover:border-primary/30">
      <div className="relative h-[130px] w-full bg-surface-elevated">
        {item.thumbnailUrl ? (
          <Image src={item.thumbnailUrl} alt="" fill className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-text-secondary/40">
            <ImageOff className="h-6 w-6" aria-hidden="true" />
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 font-sans text-[9.5px] font-semibold text-white capitalize">
          {item.kind}
        </span>

        {item.mediaType === "video" && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white">
              <Play className="h-4 w-4" aria-hidden="true" />
            </span>
          </span>
        )}

        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 font-sans text-[9px] font-semibold",
              item.scheduled ? "bg-primary/16 text-primary-light" : "bg-success/16 text-success",
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", item.scheduled ? "bg-primary-light" : "bg-success")} aria-hidden="true" />
            {item.scheduled ? "Scheduled" : "Published"}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3.5">
        <div className="min-w-0 flex-1">
          <div className="truncate font-sans text-[13px] font-medium text-text-primary">{item.title || item.description || "Untitled"}</div>
          <div className="mt-0.5 font-sans text-[10.5px] font-light text-text-secondary/60">{item.dateLabel}</div>
        </div>
        <MyContentContextMenu onPreview={onPreview} onDelete={onDelete} />
      </div>

      {item.kind === "post" && (
        <div className="flex items-center gap-3.5 border-t border-primary/8 px-3.5 py-2.5">
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
    </div>
  );
}
