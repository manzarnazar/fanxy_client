"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, RefreshCw, Sparkles, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStoryGroups } from "@/store/slices/storyViewSlice";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";

export function StoriesIndexContent() {
  const dispatch = useAppDispatch();
  const { groups, groupsStatus, groupsError } = useAppSelector((state) => state.storyView);

  useEffect(() => {
    if (groupsStatus !== "idle") return;
    void dispatch(fetchStoryGroups());
  }, [dispatch, groupsStatus]);

  const isLoading = groupsStatus === "loading" || groupsStatus === "idle";

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[960px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-[26px] leading-tight font-semibold text-text-primary">Stories</h1>
            <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
              Catch up on the latest 24-hour updates from creators.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void dispatch(fetchStoryGroups())}
            disabled={isLoading}
            title="Refresh"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/12 hover:text-text-primary disabled:opacity-60"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} aria-hidden="true" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse rounded-[18px] border border-primary/10 bg-surface/40" />
            ))}
          </div>
        ) : groupsStatus === "failed" ? (
          <SectionStateMessage
            variant="error"
            title="Unable to load stories"
            body={groupsError ?? "Something went wrong. Please try again."}
            onRetry={() => void dispatch(fetchStoryGroups())}
          />
        ) : groups.length === 0 ? (
          <SectionStateMessage
            variant="empty"
            icon={Sparkles}
            title="No stories right now"
            body="When creators post stories, they'll show up here for 24 hours."
            emptyHref={ROUTES.HOME}
            emptyLabel="Explore Home"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {groups.map((group) => (
              <Link
                key={group.creatorId}
                href={ROUTES.STORY_VIEW(group.username)}
                className="group relative aspect-[3/4] overflow-hidden rounded-[18px] border border-primary/14 bg-surface-elevated transition hover:-translate-y-1 hover:border-primary/32"
              >
                {/* Latest story as the tile cover */}
                {group.latestStoryUrl &&
                  (group.latestStoryType === "video" ? (
                    <video src={group.latestStoryUrl} muted playsInline className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <Image src={group.latestStoryUrl} alt="" fill sizes="240px" className="object-cover transition group-hover:scale-105" />
                  ))}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

                {group.latestStoryType === "video" && (
                  <span className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                )}

                <div className="absolute right-0 bottom-0 left-0 flex flex-col items-center gap-1.5 p-3">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-full p-[2.5px]",
                      group.allViewed
                        ? "bg-text-secondary/30"
                        : "bg-[conic-gradient(from_120deg,#7fd4f5,#c1a3ff,#ff5b78,#e8cf85,#7fd4f5)]",
                    )}
                  >
                    <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
                      {group.avatarUrl ? (
                        <Image src={group.avatarUrl} alt="" width={44} height={44} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-text-secondary/60" aria-hidden="true" />
                      )}
                    </span>
                  </div>
                  <span className="max-w-full truncate font-sans text-[12.5px] font-semibold text-white">
                    {group.name}
                  </span>
                  <span className="font-sans text-[10px] font-light text-white/65">
                    {formatCount(group.storyCount)} {group.storyCount === 1 ? "story" : "stories"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
