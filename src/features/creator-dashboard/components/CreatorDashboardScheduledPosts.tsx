import Image from "next/image";
import { CalendarClock, ImageIcon } from "lucide-react";
import type { ScheduledPostSummary } from "@/features/creator-dashboard/types/creator-dashboard.types";

interface CreatorDashboardScheduledPostsProps {
  posts: ScheduledPostSummary[];
}

export function CreatorDashboardScheduledPosts({ posts }: CreatorDashboardScheduledPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-5">
      <div className="mb-3.5 font-display text-lg font-semibold text-text-primary">Scheduled posts</div>
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary/12 text-primary-light">
              {post.thumbnailUrl ? (
                <Image src={post.thumbnailUrl} alt="" width={36} height={36} className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-sans text-[13px] font-medium text-text-primary">{post.title ?? "Untitled"}</div>
              <div className="flex items-center gap-1 font-sans text-[11px] font-light text-text-secondary/65">
                <CalendarClock className="h-3 w-3" aria-hidden="true" />
                {post.scheduleDateLabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
