import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ImageIcon, MessageCircle, Play } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { ContentPerformanceItem } from "@/features/creator-dashboard/types/creator-dashboard.types";

interface CreatorDashboardContentPerformanceProps {
  items: ContentPerformanceItem[];
}

export function CreatorDashboardContentPerformance({ items }: CreatorDashboardContentPerformanceProps) {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <div className="font-display text-lg font-semibold text-text-primary">Content performance</div>
        <Link href={ROUTES.MY_CONTENT} className="font-sans text-[12px] font-medium text-primary-light">
          View all
        </Link>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-1.5">
        {items.map((item) => (
          <div key={item.id} className="w-[190px] shrink-0">
            <div className="relative flex h-[190px] w-[190px] items-center justify-center overflow-hidden rounded-md bg-surface-elevated">
              {item.thumbnailUrl ? (
                <Image src={item.thumbnailUrl} alt="" fill className="object-cover" />
              ) : (
                <ImageIcon className="h-8 w-8 text-text-secondary/40" aria-hidden="true" />
              )}
              {item.isVideo && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white">
                    <Play className="h-4 w-4" aria-hidden="true" />
                  </span>
                </span>
              )}
              <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-sm bg-black/50 px-1.5 py-0.5 font-sans text-[9.5px] text-white">
                <Eye className="h-3 w-3" aria-hidden="true" />
                {item.viewCount.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 truncate font-sans text-[12.5px] font-medium text-text-primary">{item.title ?? "Untitled"}</div>
            <div className="mt-1 flex items-center gap-3 font-sans text-[10.5px] font-light text-text-secondary/65">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" aria-hidden="true" />
                {item.likeCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" aria-hidden="true" />
                {item.commentCount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
