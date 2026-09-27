import Image from "next/image";
import { Eye, Heart, ImageOff, MessageCircle, Play } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";
import type { AnalyticsPost } from "@/features/creator-analytics/types/creator-analytics.types";

interface AnalyticsTopContentCardProps {
  posts: AnalyticsPost[];
}

export function AnalyticsTopContentCard({ posts }: AnalyticsTopContentCardProps) {
  if (posts.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-4.5">
      <div className="mb-3.5 font-display text-base font-semibold text-text-primary">Top performing content</div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="overflow-hidden rounded-lg border border-primary/10 bg-surface-elevated/40">
            <div className="relative aspect-[4/3] bg-surface">
              {post.thumbnailUrl ? (
                <Image src={post.thumbnailUrl} alt="" fill sizes="220px" className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-text-secondary/40">
                  <ImageOff className="h-6 w-6" aria-hidden="true" />
                </span>
              )}
              {post.isVideo && (
                <span className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              )}
              <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 font-sans text-[10px] font-semibold text-white backdrop-blur-sm">
                {post.engagementPercent}% engagement
              </span>
            </div>
            <div className="p-3">
              <p className="truncate font-sans text-[12.5px] font-medium text-text-primary">{post.title}</p>
              <div className="mt-1.5 flex items-center gap-3 font-sans text-[11px] font-light text-text-secondary/70">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" aria-hidden="true" />
                  {formatCount(post.viewCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" aria-hidden="true" />
                  {formatCount(post.likeCount)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" aria-hidden="true" />
                  {formatCount(post.commentCount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
