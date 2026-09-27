"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Loader2, Lock, Radio, User } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { formatCount } from "@/lib/formatter/count";
import { ROUTES } from "@/lib/constants/routes";
import { useLiveStreams } from "@/features/live/hooks/useLiveStreams";
import type { LiveStreamCard } from "@/features/live/types/live.types";

function StreamCard({ stream, ownUserId }: { stream: LiveStreamCard; ownUserId: string | null }) {
  const isOwn = ownUserId !== null && stream.creatorId === ownUserId;
  const locked = stream.locked && !isOwn;
  // Locked streams route to the host's plans; unlocked ones join the room.
  const href = locked
    ? ROUTES.SUBSCRIBE_PLANS(stream.creatorId, stream.name)
    : ROUTES.LIVE_WATCH(stream.roomId, stream.creatorId);

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border border-primary/14 bg-surface/50 p-4 transition hover:-translate-y-0.5 hover:border-primary/30"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-live to-primary p-0.5">
          <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
            {stream.avatarUrl ? (
              <Image src={stream.avatarUrl} alt="" fill sizes="56px" className="object-cover" />
            ) : (
              <User className="h-6 w-6 text-text-secondary/60" aria-hidden="true" />
            )}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-sans text-[14px] font-semibold text-text-primary">{stream.name}</div>
          <div className="truncate font-sans text-[11.5px] font-light text-text-secondary">{stream.username}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-live/16 px-2 py-0.5 font-sans text-[9px] font-bold tracking-wide text-live uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />
              Live
            </span>
            <span className="flex items-center gap-1 font-sans text-[11px] font-light text-text-muted">
              <Eye className="h-3 w-3" aria-hidden="true" />
              {formatCount(stream.viewerCount)}
            </span>
          </div>
        </div>
        {locked && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-surface">
            <Lock className="h-4 w-4 text-primary-light" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="mt-3 rounded-md bg-primary/8 py-2 text-center font-sans text-[11.5px] font-semibold text-primary-light transition-colors group-hover:bg-primary/14">
        {locked ? "Subscribe to watch" : "Watch live"}
      </div>
    </Link>
  );
}

export function LiveDiscoveryContent() {
  const { items, status, error, hasMore, sentinelRef, retry } = useLiveStreams();
  const user = useAppSelector((state) => state.auth.user);
  const isCreator = user?.isCreator ?? false;

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[880px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-[26px] font-semibold text-text-primary">Live Now</h1>
            <p className="mt-1 font-sans text-[12.5px] font-light text-text-secondary">
              Watch creators streaming right now.
            </p>
          </div>
          {isCreator && (
            <Link
              href={ROUTES.GO_LIVE}
              className="flex items-center gap-2 rounded-md bg-gradient-to-r from-live to-secondary-dark px-5 py-2.5 font-sans text-[12.5px] font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
            >
              <Radio className="h-4 w-4" aria-hidden="true" />
              Go Live
            </Link>
          )}
        </div>

        {status === "loading" && items.length === 0 && (
          <div className="grid gap-3 sm:grid-cols-2" role="status" aria-label="Loading live streams">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-[130px] animate-pulse rounded-xl bg-surface" />
            ))}
          </div>
        )}

        {status === "failed" && items.length === 0 && (
          <SectionStateMessage
            variant="error"
            title="Couldn't load live streams"
            body={error ?? "Something went wrong. Please try again."}
            onRetry={retry}
            minHeightClassName="min-h-[380px]"
          />
        )}

        {status === "succeeded" && items.length === 0 && (
          <SectionStateMessage
            variant="empty"
            title="No one is live right now"
            body="Check back soon — creators go live throughout the day."
            minHeightClassName="min-h-[380px]"
          />
        )}

        {items.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((stream) => (
              <StreamCard key={stream.id} stream={stream} ownUserId={user?.id ?? null} />
            ))}
          </div>
        )}

        {hasMore && items.length > 0 && (
          <div ref={sentinelRef} className="flex items-center justify-center gap-2.5 py-4">
            <Loader2 className="h-4 w-4 animate-spin text-primary-light" aria-hidden="true" />
            <span className="font-sans text-[12.5px] font-light text-text-secondary/70">Loading more streams…</span>
          </div>
        )}
      </div>
    </main>
  );
}
