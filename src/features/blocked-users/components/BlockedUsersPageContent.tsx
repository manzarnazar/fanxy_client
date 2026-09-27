"use client";

import Image from "next/image";
import Link from "next/link";
import { Ban, Check, Loader2, Search, User, X } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { formatRelativeTime } from "@/lib/formatter/relativeTime";
import { ROUTES } from "@/lib/constants/routes";
import { useBlockedUsers } from "@/features/blocked-users/hooks/useBlockedUsers";
import type { BlockedUser } from "@/features/blocked-users/types/blocked-users.types";

function BlockedUserRow({
  user,
  unblocking,
  onUnblock,
}: {
  user: BlockedUser;
  unblocking: boolean;
  onUnblock: (user: BlockedUser) => void;
}) {
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <Link
        href={ROUTES.CREATOR_PROFILE(user.blockUserId)}
        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface"
        aria-label={`View ${user.name}'s profile`}
      >
        {user.avatarUrl ? (
          <Image src={user.avatarUrl} alt="" fill sizes="44px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center">
            <User className="h-5 w-5 text-text-secondary/60" aria-hidden="true" />
          </span>
        )}
        <span className="absolute right-0 bottom-0 flex h-4 w-4 items-center justify-center rounded-full border border-surface-elevated bg-live">
          <Ban className="h-2.5 w-2.5 text-white" aria-hidden="true" />
        </span>
      </Link>

      <div className="min-w-0 flex-1">
        <div className="truncate font-sans text-[13.5px] font-semibold text-text-primary">{user.name}</div>
        <div className="truncate font-sans text-[11.5px] font-light text-text-secondary">
          {user.username} · Blocked {formatRelativeTime(user.blockedAt)}
        </div>
      </div>

      <button
        type="button"
        disabled={unblocking}
        onClick={() => onUnblock(user)}
        className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-primary-light to-primary px-4 py-2 font-sans text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {unblocking ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        Unblock
      </button>
    </li>
  );
}

export function BlockedUsersPageContent() {
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const { users, allCount, query, setQuery, status, error, hasMore, unblockingId, sentinelRef, onUnblock, retry } =
    useBlockedUsers();

  if (isBootstrapped && !user) {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[680px]">
          <SectionStateMessage
            variant="empty"
            title="Sign in to manage blocked accounts"
            body="Your block list lives in your account."
            emptyHref={ROUTES.SIGN_IN}
            emptyLabel="Sign In"
          />
        </div>
      </main>
    );
  }

  const searching = query.trim().length > 0;

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[680px]">
        <h1 className="font-display text-[26px] font-semibold text-text-primary">Blocked accounts</h1>
        <p className="mt-1 font-sans text-[12.5px] font-light text-text-secondary">
          Blocked users can&apos;t see your content or message you.
        </p>

        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search blocked accounts"
            aria-label="Search blocked accounts"
            className="w-full rounded-md border border-primary/16 bg-surface/60 py-2.5 pr-10 pl-10 font-sans text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
          />
          {searching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary hover:bg-primary/10"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {status === "loading" && users.length === 0 && (
          <div className="mt-4 flex flex-col gap-2" role="status" aria-label="Loading blocked accounts">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-[70px] animate-pulse rounded-xl bg-surface" />
            ))}
          </div>
        )}

        {status === "failed" && users.length === 0 && (
          <SectionStateMessage
            variant="error"
            title="Couldn't load blocked accounts"
            body={error ?? "Something went wrong. Please try again."}
            onRetry={retry}
            minHeightClassName="min-h-[320px]"
          />
        )}

        {status === "succeeded" && users.length === 0 && (
          <SectionStateMessage
            variant="empty"
            title={searching ? "No matching accounts" : "No blocked accounts"}
            body={
              searching
                ? "Try a different name or username."
                : "When you block someone, they'll show up here."
            }
            minHeightClassName="min-h-[320px]"
          />
        )}

        {users.length > 0 && (
          <>
            <div className="mt-4 font-sans text-[11.5px] font-light text-text-muted">
              {searching ? `${users.length} matching` : `${allCount} blocked`} account{(searching ? users.length : allCount) === 1 ? "" : "s"}
            </div>
            <ul className="mt-2 divide-y divide-primary/8 rounded-xl border border-primary/14 bg-surface/50">
              {users.map((blockedUser) => (
                <BlockedUserRow
                  key={blockedUser.id}
                  user={blockedUser}
                  unblocking={unblockingId === blockedUser.blockUserId}
                  onUnblock={onUnblock}
                />
              ))}
            </ul>
          </>
        )}

        {hasMore && users.length > 0 && !searching && (
          <div ref={sentinelRef} className="flex items-center justify-center gap-2.5 py-4">
            <Loader2 className="h-4 w-4 animate-spin text-primary-light" aria-hidden="true" />
            <span className="font-sans text-[12.5px] font-light text-text-secondary/70">Loading more…</span>
          </div>
        )}
      </div>
    </main>
  );
}
