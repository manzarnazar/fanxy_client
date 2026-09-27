import Image from "next/image";
import { Clock, ImageOff } from "lucide-react";
import { ScheduledCountdown } from "@/features/scheduled-posts/components/ScheduledCountdown";
import type { ScheduledPost } from "@/features/scheduled-posts/types/scheduled-posts.types";

interface ScheduledRightRailProps {
  todaysPosts: ScheduledPost[];
  upNext: ScheduledPost[];
  onSelectPost: (post: ScheduledPost) => void;
  onExpired: () => void;
}

export function ScheduledRightRail({ todaysPosts, upNext, onSelectPost, onExpired }: ScheduledRightRailProps) {
  return (
    <aside className="hidden w-[300px] shrink-0 flex-col gap-4 xl:flex">
      {upNext.length > 0 && (
        <div className="rounded-xl border border-primary/14 bg-surface/50 p-4">
          <div className="mb-3 font-display text-base font-semibold text-text-primary">Up next</div>
          <div className="flex flex-col gap-3">
            {upNext.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => onSelectPost(post)}
                className="overflow-hidden rounded-lg border border-primary/12 bg-surface-elevated/40 text-left transition hover:border-primary/28"
              >
                <div className="relative aspect-[5/2.4] bg-surface">
                  {post.thumbnailUrl ? (
                    <Image src={post.thumbnailUrl} alt="" fill sizes="270px" className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-text-secondary/40">
                      <ImageOff className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <div className="truncate font-sans text-[12.5px] font-medium text-text-primary">{post.title}</div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-sans text-[10.5px] font-light text-text-secondary/70">
                      {post.dateLabel} · {post.timeLabel}
                    </span>
                    <ScheduledCountdown targetMs={post.scheduledAtMs} onExpired={onExpired} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-primary/14 bg-surface/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-display text-base font-semibold text-text-primary">Today&apos;s schedule</span>
          <span className="rounded-full bg-primary/12 px-2 py-0.5 font-sans text-[10.5px] font-semibold text-primary-light">
            {todaysPosts.length}
          </span>
        </div>
        {todaysPosts.length === 0 ? (
          <p className="font-sans text-[12px] font-light text-text-secondary/70">Nothing scheduled for today.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {todaysPosts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => onSelectPost(post)}
                className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left transition hover:bg-primary/8"
              >
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-surface-elevated">
                  {post.thumbnailUrl ? (
                    <Image src={post.thumbnailUrl} alt="" fill sizes="36px" className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-text-secondary/40">
                      <ImageOff className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-sans text-[12px] font-medium text-text-primary">{post.title}</div>
                  <div className="flex items-center gap-1 font-sans text-[10.5px] font-light text-text-secondary/65">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {post.timeLabel}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
