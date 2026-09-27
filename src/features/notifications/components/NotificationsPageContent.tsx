"use client";

import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useNotificationsFeed } from "@/features/notifications/hooks/useNotificationsFeed";
import { NotificationsHeaderBar } from "@/features/notifications/components/NotificationsHeaderBar";
import { NotificationsListSkeleton } from "@/features/notifications/components/NotificationsListSkeleton";
import { NotificationsEmptyState } from "@/features/notifications/components/NotificationsEmptyState";
import { NotificationGroupSection } from "@/features/notifications/components/NotificationGroupSection";

export function NotificationsPageContent() {
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const { groups, status, error, hasMore, sentinelRef, retry, refresh, refreshing, markRead } = useNotificationsFeed();

  const isEmpty = status !== "loading" && status !== "failed" && groups.length === 0;

  // Notifications are account-scoped — guests get a sign-in prompt, not an error.
  if (isBootstrapped && !user) {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[680px]">
          <SectionStateMessage
            variant="empty"
            title="Sign in to see notifications"
            body="Your notifications live in your account."
            emptyHref={ROUTES.SIGN_IN}
            emptyLabel="Sign In"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[680px]">
        <NotificationsHeaderBar onRefresh={refresh} refreshing={refreshing} />

        {status === "loading" && groups.length === 0 && <NotificationsListSkeleton />}

        {status === "failed" && groups.length === 0 && (
          <SectionStateMessage
            variant="error"
            title="Something went wrong"
            body={error ?? "We couldn't load notifications right now. Please try again."}
            onRetry={retry}
            minHeightClassName="min-h-[420px]"
          />
        )}

        {isEmpty && <NotificationsEmptyState />}

        {groups.length > 0 && (
          <div className="flex flex-col">
            {groups.map((group) => (
              <NotificationGroupSection key={group.key} group={group} onOpen={markRead} />
            ))}

            {hasMore && (
              <div ref={sentinelRef} className="flex items-center justify-center gap-2.5 py-4">
                <Loader2 className="h-4 w-4 animate-spin text-primary-light" aria-hidden="true" />
                <span className="font-sans text-[12.5px] font-light text-text-secondary/70">Loading earlier activity…</span>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
