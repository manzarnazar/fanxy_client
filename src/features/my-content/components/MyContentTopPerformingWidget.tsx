import Image from "next/image";
import { ImageOff } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";
import { cn } from "@/lib/utils/cn";
import type { ContentItem } from "@/features/my-content/types/my-content.types";

const RANK_COLOR_CLASSNAMES = ["text-accent-gold-light", "text-[#cfeaf8]", "text-[#e0a06a]"];

interface MyContentTopPerformingWidgetProps {
  items: ContentItem[];
}

export function MyContentTopPerformingWidget({ items }: MyContentTopPerformingWidgetProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-4">
      <div className="mb-3.5 font-display text-base font-semibold text-text-primary">Top performing</div>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2.5">
            <span className={cn("w-4 shrink-0 font-display text-sm font-semibold", RANK_COLOR_CLASSNAMES[index] ?? "text-text-secondary/50")}>
              {index + 1}
            </span>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-surface-elevated">
              {item.thumbnailUrl ? (
                <Image src={item.thumbnailUrl} alt="" fill className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-text-secondary/40">
                  <ImageOff className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-sans text-[12.5px] font-medium text-text-primary">{item.title || item.description || "Untitled"}</div>
              <div className="font-sans text-[10.5px] font-light text-text-secondary/60">
                {formatCount(item.viewCount)} views · {formatCount(item.likeCount ?? 0)} likes
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
