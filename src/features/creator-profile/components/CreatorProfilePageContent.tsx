"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleBlockCreator } from "@/store/slices/creatorProfileSlice";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { toast } from "@/lib/utils/toast";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { chatService, generateConvId } from "@/features/messages/services/chat.service";
import { useCreatorProfile } from "@/features/creator-profile/hooks/useCreatorProfile";
import { CreatorProfileSkeleton } from "@/features/creator-profile/components/CreatorProfileSkeleton";
import { CreatorProfileHero } from "@/features/creator-profile/components/CreatorProfileHero";
import { CreatorProfilePostsGrid } from "@/features/creator-profile/components/CreatorProfilePostsGrid";
import { CreatorProfilePostModal } from "@/features/creator-profile/components/CreatorProfilePostModal";
import type { CreatorProfilePost } from "@/features/creator-profile/types/creator-profile.types";

interface CreatorProfilePageContentProps {
  creatorId: string;
}

export function CreatorProfilePageContent({ creatorId }: CreatorProfilePageContentProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { requireAuth } = useAuthGuard();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { profile, status, error, posts, blockPending, sentinelRef, retry } = useCreatorProfile(creatorId);

  const [openPost, setOpenPost] = useState<CreatorProfilePost | null>(null);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
  const [messagePending, setMessagePending] = useState(false);

  // Your own profile lives at /profile — mirrors the Flutter routing, which
  // opens CreatorProfile (self) instead of OtherProfile for your own id.
  const isOwnProfile = currentUser?.id === creatorId;
  useEffect(() => {
    if (isOwnProfile) router.replace(ROUTES.PROFILE);
  }, [isOwnProfile, router]);
  if (isOwnProfile) return null;

  const handleMessage = () =>
    requireAuth(() => {
      const myUid = currentUser?.firebaseId;
      if (!profile || !myUid) return;
      if (!profile.firebaseId) {
        // Accounts that never linked Firebase Auth have no chat identity —
        // a real backend/mobile constraint, not a bug.
        toast.error(`${profile.name} isn't available for chat yet.`);
        return;
      }
      const peerUid = profile.firebaseId;
      const convId = generateConvId(myUid, peerUid);
      setMessagePending(true);
      chatService
        .ensureConversation(convId, myUid, peerUid)
        .then(() => router.push(ROUTES.CHAT(convId)))
        .catch(() => toast.error("Unable to start conversation."))
        .finally(() => setMessagePending(false));
    }, "Sign in to send messages.");

  const handleUnlock = () =>
    requireAuth(() => {
      if (!profile) return;
      router.push(ROUTES.SUBSCRIBE_PLANS(profile.id, profile.name));
    }, "Sign in to subscribe and unlock posts.");

  const handleShare = async () => {
    if (!profile) return;
    const url = `${window.location.origin}${ROUTES.CREATOR_PROFILE(profile.id)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: profile.name, url });
      } catch {
        // user cancelled the native share sheet — no error to surface
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.info("Profile link copied");
    } catch {
      toast.error("Unable to share profile.");
    }
  };

  const handleCopyLink = async () => {
    if (!profile) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${ROUTES.CREATOR_PROFILE(profile.id)}`);
      toast.info("Profile link copied");
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  const handleToggleBlock = () => {
    if (!profile) return;
    if (profile.blocked) {
      dispatch(toggleBlockCreator(profile.id))
        .unwrap()
        .then(() => toast.success(`Unblocked ${profile.name}`))
        .catch(() => undefined);
      return;
    }
    setBlockConfirmOpen(true);
  };

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-5 py-5 pb-[100px] lg:pb-5">
      <div className="mx-auto max-w-[680px]">
        {status === "loading" && !profile && <CreatorProfileSkeleton />}

        {status === "failed" && !profile && (
          <SectionStateMessage
            variant="error"
            title="Couldn't load this profile"
            body={error ?? "Something went wrong. Please try again."}
            onRetry={retry}
            minHeightClassName="min-h-[70vh]"
          />
        )}

        {profile && (
          <>
            <CreatorProfileHero
              profile={profile}
              postCount={posts.totalRows}
              onMessage={handleMessage}
              messagePending={messagePending}
              onShare={() => void handleShare()}
              onCopyLink={() => void handleCopyLink()}
              onToggleBlock={handleToggleBlock}
              blockPending={blockPending}
            />

            <div className="mt-5">
              <h2 className="mb-3 font-sans text-[13px] font-semibold tracking-wide text-text-secondary uppercase">
                Posts
              </h2>
              <CreatorProfilePostsGrid
                posts={posts.items}
                status={posts.status}
                error={posts.error}
                hasMore={posts.hasMore}
                sentinelRef={sentinelRef}
                onRetry={retry}
                onOpenPost={setOpenPost}
                onUnlock={handleUnlock}
              />
            </div>
          </>
        )}
      </div>

      {openPost && profile && (
        <CreatorProfilePostModal post={openPost} creatorName={profile.name} onClose={() => setOpenPost(null)} />
      )}

      {profile && (
        <ConfirmDialog
          title={`Block ${profile.name}?`}
          description="You won't see their content anymore, and they won't be notified. You can tap Block again later to unblock."
          confirmLabel="Block user"
          open={blockConfirmOpen}
          onClose={() => setBlockConfirmOpen(false)}
          onConfirm={() => dispatch(toggleBlockCreator(profile.id)).unwrap()}
          successMessage={`Blocked ${profile.name}`}
        />
      )}
    </main>
  );
}
