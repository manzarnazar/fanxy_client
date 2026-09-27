"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Crown, TrendingUp, User, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { ROUTES } from "@/lib/constants/routes";
import type { Reel } from "@/features/reels/types/reels.types";

interface ReelsRightSidebarProps {
  currentReel: Reel;
  reels: Reel[];
  onSelectReel: (reelId: string) => void;
  onToggleSubscribe: (creatorId: string) => void;
  onToggleFollow: (creatorId: string) => void;
}

export function ReelsRightSidebar({
  currentReel,
  reels,
  onSelectReel,
  onToggleSubscribe,
  onToggleFollow,
}: ReelsRightSidebarProps) {
  const trending = useMemo(
    () => [...reels].sort((a, b) => b.viewCount - a.viewCount).slice(0, 4),
    [reels],
  );

  const recommended = useMemo(() => {
    const seen = new Set<string>([currentReel.creatorId]);
    const creators: Reel[] = [];
    for (const reel of reels) {
      if (!seen.has(reel.creatorId)) {
        seen.add(reel.creatorId);
        creators.push(reel);
      }
      if (creators.length >= 3) break;
    }
    return creators;
  }, [reels, currentReel.creatorId]);

  return (
    <aside className="sticky top-[94px] hidden max-h-[calc(100vh-110px)] w-[330px] shrink-0 flex-col gap-4 overflow-y-auto py-5.5 xl:flex">
      <div className="shrink-0 overflow-hidden rounded-xl border border-primary/14 bg-surface/50 shadow-[0_18px_40px_-28px_rgba(0,0,0,.8)]">
        <div className="relative h-[74px] bg-gradient-to-br from-primary-dark to-surface-elevated">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/75" />
        </div>
        <div className="-mt-7 px-4 pb-4">
          <Link
            href={ROUTES.CREATOR_PROFILE(currentReel.creatorId)}
            aria-label={`View ${currentReel.creatorFullName}'s profile`}
            className="relative z-10 block h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-primary-light to-primary p-0.5"
          >
            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
              {currentReel.creatorAvatarUrl ? (
                <Image src={currentReel.creatorAvatarUrl} alt="" width={56} height={56} className="h-full w-full object-cover" />
              ) : (
                <User className="h-6 w-6 text-text-secondary/60" aria-hidden="true" />
              )}
            </span>
          </Link>
          <Link
            href={ROUTES.CREATOR_PROFILE(currentReel.creatorId)}
            className="mt-2.5 block font-display text-lg font-semibold text-text-primary hover:text-primary-light"
          >
            {currentReel.creatorFullName}
          </Link>
          <div className="font-sans text-[11.5px] font-light text-text-muted">@{currentReel.creatorName}</div>

          <div className="mt-3.5 flex gap-2">
            <button
              type="button"
              onClick={() => onToggleSubscribe(currentReel.creatorId)}
              className={cn(
                "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md font-sans text-[12.5px] font-semibold transition hover:-translate-y-0.5",
                currentReel.subscribedByMe
                  ? "bg-secondary/16 text-secondary-light"
                  : "bg-gradient-to-br from-secondary-light to-secondary-dark text-white shadow-[0_12px_26px_-12px_rgba(226,29,91,.7)]",
              )}
            >
              <Crown className="h-3.5 w-3.5" aria-hidden="true" />
              {currentReel.subscribedByMe ? "Subscribed" : "Subscribe"}
            </button>
            <button
              type="button"
              onClick={() => onToggleFollow(currentReel.creatorId)}
              aria-label={currentReel.followedByMe ? "Unfollow creator" : "Follow creator"}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/22 bg-surface/70 text-primary-light transition hover:bg-primary/12"
            >
              <UserPlus className="h-[17px] w-[17px]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {trending.length > 0 && (
        <div className="shrink-0 rounded-xl border border-primary/14 bg-surface/50 p-4">
          <div className="mb-3.5 flex items-center gap-1.5 font-sans text-[12.5px] font-medium text-text-primary">
            <TrendingUp className="h-[15px] w-[15px] text-live" aria-hidden="true" />
            Trending reels
          </div>
          <div className="flex flex-col gap-2.5">
            {trending.map((reel, index) => (
              <button
                key={reel.id}
                type="button"
                onClick={() => onSelectReel(reel.id)}
                className="flex items-center gap-2.5 rounded-md p-1.5 text-left transition hover:bg-primary/7"
              >
                <span
                  className={cn(
                    "w-4 shrink-0 text-center font-display text-base font-semibold",
                    index === 0 ? "text-live" : index === 1 ? "text-accent-gold" : "text-primary-light",
                  )}
                >
                  {index + 1}
                </span>
                <div className="relative h-14 w-[42px] shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-primary-dark to-surface-elevated" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-sans text-xs font-medium text-text-primary">{reel.title ?? reel.creatorFullName}</div>
                  <div className="truncate font-sans text-[10.5px] font-light text-text-muted">{reel.creatorFullName}</div>
                  <div className="mt-0.5 font-sans text-[10px] font-light text-primary-light">
                    {formatCount(reel.viewCount)} views
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {recommended.length > 0 && (
        <div className="shrink-0 rounded-xl border border-primary/14 bg-surface/50 p-4">
          <div className="mb-3.5 flex items-center gap-1.5 font-sans text-[12.5px] font-medium text-text-primary">
            <UserPlus className="h-[15px] w-[15px] text-primary-light" aria-hidden="true" />
            Recommended for you
          </div>
          <div className="flex flex-col gap-3">
            {recommended.map((reel) => (
              <div key={reel.creatorId} className="flex items-center gap-2.5">
                <Link href={ROUTES.PROFILE} className="relative shrink-0 overflow-hidden rounded-full">
                  {reel.creatorAvatarUrl ? (
                    <Image src={reel.creatorAvatarUrl} alt="" width={40} height={40} className="h-10 w-10 object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center bg-surface-elevated text-text-secondary/60">
                      <User className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <span className="truncate font-sans text-[12.5px] font-medium text-text-primary">{reel.creatorFullName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleFollow(reel.creatorId)}
                  className={cn(
                    "shrink-0 rounded-md px-3.5 py-1.5 font-sans text-[11px] font-semibold transition hover:scale-105",
                    reel.followedByMe
                      ? "border border-primary/25 bg-primary/12 text-primary-light"
                      : "bg-gradient-to-br from-primary-light to-primary text-[#03283a]",
                  )}
                >
                  {reel.followedByMe ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
