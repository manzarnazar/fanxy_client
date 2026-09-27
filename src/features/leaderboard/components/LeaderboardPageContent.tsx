"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Crown, Trophy, User } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectCurrencySymbol } from "@/store/slices/appSettingsSlice";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { formatCount } from "@/lib/formatter/count";
import { ROUTES } from "@/lib/constants/routes";
import { useLeaderboard } from "@/features/leaderboard/hooks/useLeaderboard";
import type { LeaderboardEntry } from "@/features/leaderboard/types/leaderboard.types";

const MEDAL_STYLES: Record<number, string> = {
  1: "border-accent-gold/50 bg-accent-gold/14 text-accent-gold",
  2: "border-text-secondary/40 bg-text-secondary/10 text-text-secondary",
  3: "border-warning/45 bg-warning/12 text-warning",
};

interface LeaderboardPageContentProps {
  /** When set, shows this creator's top fans instead of global top creators. */
  creatorId?: string;
  creatorName?: string;
}

function EntryAvatar({ entry, sizeClass }: { entry: LeaderboardEntry; sizeClass: string }) {
  return (
    <span className={`relative block ${sizeClass} overflow-hidden rounded-full bg-surface`}>
      {entry.avatarUrl ? (
        <Image src={entry.avatarUrl} alt="" fill sizes="80px" className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center">
          <User className="h-1/2 w-1/2 text-text-secondary/60" aria-hidden="true" />
        </span>
      )}
    </span>
  );
}

export function LeaderboardPageContent({ creatorId, creatorName }: LeaderboardPageContentProps) {
  const fansMode = Boolean(creatorId);
  const { entries, status, error, retry } = useLeaderboard(fansMode ? "fans" : "creators", creatorId);
  const currencySymbol = useAppSelector(selectCurrencySymbol);

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);
  const amountLabel = fansMode ? "spent" : "earned";

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[680px]">
        <div className="flex items-center gap-3">
          {fansMode && (
            <Link
              href={ROUTES.CREATOR_PROFILE(creatorId ?? "")}
              aria-label="Back to profile"
              className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-primary/20 bg-surface text-text-secondary transition-colors hover:border-primary/40 hover:text-text-primary"
            >
              <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
            </Link>
          )}
          <div>
            <h1 className="flex items-center gap-2 font-display text-[26px] font-semibold text-text-primary">
              <Trophy className="h-5.5 w-5.5 text-accent-gold" aria-hidden="true" />
              {fansMode ? `${creatorName || "Creator"}'s Top Fans` : "Top Creators"}
            </h1>
            <p className="mt-1 font-sans text-[12.5px] font-light text-text-secondary">
              {fansMode
                ? "The biggest supporters, ranked by lifetime spend."
                : "The highest-earning creators on the platform."}
            </p>
          </div>
        </div>

        {status === "loading" && entries.length === 0 && (
          <div className="mt-5 flex flex-col gap-2" role="status" aria-label="Loading leaderboard">
            <div className="h-[180px] animate-pulse rounded-xl bg-surface" />
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-[64px] animate-pulse rounded-xl bg-surface" />
            ))}
          </div>
        )}

        {status === "failed" && (
          <SectionStateMessage
            variant="error"
            title="Couldn't load the leaderboard"
            body={error ?? "Something went wrong. Please try again."}
            onRetry={retry}
            minHeightClassName="min-h-[380px]"
          />
        )}

        {status === "succeeded" && entries.length === 0 && (
          <SectionStateMessage
            variant="empty"
            title={fansMode ? "No fans ranked yet" : "No creators ranked yet"}
            body={
              fansMode
                ? "Subscriptions and gifts will rank supporters here."
                : "Creator earnings will build this leaderboard."
            }
            minHeightClassName="min-h-[380px]"
          />
        )}

        {podium.length > 0 && (
          <div className="mt-5 grid grid-cols-3 items-end gap-3">
            {[podium[1], podium[0], podium[2]].map((entry) =>
              entry ? (
                <Link
                  key={entry.userId}
                  href={ROUTES.CREATOR_PROFILE(entry.userId)}
                  className={`flex flex-col items-center rounded-xl border bg-surface/50 px-3 pb-4 transition hover:-translate-y-0.5 hover:border-primary/35 ${
                    entry.rank === 1 ? "border-accent-gold/35 pt-5" : "border-primary/14 pt-8"
                  }`}
                >
                  {entry.rank === 1 && <Crown className="mb-1.5 h-5 w-5 text-accent-gold" aria-hidden="true" />}
                  <EntryAvatar entry={entry} sizeClass={entry.rank === 1 ? "h-20 w-20" : "h-14 w-14"} />
                  <span
                    className={`-mt-3 flex h-7 w-7 items-center justify-center rounded-full border font-sans text-[11px] font-bold ${MEDAL_STYLES[entry.rank]}`}
                  >
                    {entry.rank}
                  </span>
                  <span className="mt-1.5 w-full truncate text-center font-sans text-[13px] font-semibold text-text-primary">
                    {entry.name}
                  </span>
                  <span className="w-full truncate text-center font-sans text-[10.5px] font-light text-text-secondary">
                    {entry.username}
                  </span>
                  <span className="mt-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-sans text-[10.5px] font-semibold text-primary-light">
                    {currencySymbol}
                    {formatCount(entry.amount)} {amountLabel}
                  </span>
                </Link>
              ) : (
                <span key="empty-podium-slot" aria-hidden="true" />
              ),
            )}
          </div>
        )}

        {rest.length > 0 && (
          <ul className="mt-4 divide-y divide-primary/8 rounded-xl border border-primary/14 bg-surface/50">
            {rest.map((entry) => (
              <li key={entry.userId}>
                <Link
                  href={ROUTES.CREATOR_PROFILE(entry.userId)}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-primary/6"
                >
                  <span className="w-7 shrink-0 text-center font-display text-[15px] font-semibold text-text-muted">
                    {entry.rank}
                  </span>
                  <EntryAvatar entry={entry} sizeClass="h-10 w-10 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-sans text-[13.5px] font-semibold text-text-primary">
                      {entry.name}
                    </span>
                    <span className="block truncate font-sans text-[11px] font-light text-text-secondary">
                    {entry.username}
                    </span>
                  </span>
                  <span className="shrink-0 font-sans text-[12.5px] font-semibold text-primary-light">
                    {currencySymbol}
                    {formatCount(entry.amount)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
