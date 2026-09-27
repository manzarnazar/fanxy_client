"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Expand,
  Heart,
  ImageOff,
  Lock,
  MessageSquare,
  Pause,
  Play,
  Share2,
  User,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { formatRelativeTime } from "@/lib/formatter/relativeTime";
import { toast } from "@/lib/utils/toast";
import { ROUTES } from "@/lib/constants/routes";
import { MediaLightbox } from "@/components/shared/MediaLightbox";
import { PostCommentsModal } from "@/features/post-comments/components/PostCommentsModal";
import type { Post } from "@/features/home/types/home.types";

const LONG_PRESS_MS = 450;

interface HomeFeedPostProps {
  post: Post;
  onToggleLike: (postId: string) => void;
}

async function handleShare(post: Post) {
  const url = `${window.location.origin}/posts/${post.id}`;
  if (navigator.share) {
    try {
      await navigator.share({
        url,
        title: `${post.creatorFullName} on Fanxy`,
      });
    } catch {
      // user cancelled the native share sheet — no action needed
    }
    return;
  }
  await navigator.clipboard.writeText(url);
  toast.success("Link copied to clipboard.");
}

export function HomeFeedPost({ post, onToggleLike }: HomeFeedPostProps) {
  const { requireAuth } = useAuthGuard();
  // Your own posts are always visible regardless of is_buy.
  const currentUserId = useAppSelector((state) => state.auth.user?.id ?? null);
  const isOwnPost = currentUserId !== null && post.creatorId === currentUserId;
  const isLocked = post.locked && !isOwnPost;

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [heartBurstKey, setHeartBurstKey] = useState(0);
  const [heartVisible, setHeartVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const longPressTimer = useRef<number | null>(null);
  const longPressFired = useRef(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const primaryMedia =
    post.media[Math.min(mediaIndex, post.media.length - 1)] ?? null;

  const goToMedia = (nextIndex: number) => {
    setMediaIndex(Math.max(0, Math.min(nextIndex, post.media.length - 1)));
    setVideoPlaying(false);
  };

  const clearLongPressTimer = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePointerDown = () => {
    longPressFired.current = false;
    clearLongPressTimer();
    longPressTimer.current = window.setTimeout(() => {
      longPressFired.current = true;
      setLightboxOpen(true);
    }, LONG_PRESS_MS);
  };

  const handlePointerUpOrLeave = () => {
    clearLongPressTimer();
  };

  const handleDoubleClick = () => {
    requireAuth(() => {
      if (!post.likedByMe) onToggleLike(post.id);
    }, "Sign in to like posts.");
    setHeartBurstKey((prev) => prev + 1);
    setHeartVisible(true);
    window.setTimeout(() => setHeartVisible(false), 700);
  };

  const handleMediaClick = () => {
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    if (primaryMedia?.type === "video" && !isLocked)
      setVideoPlaying((prev) => !prev);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-primary/13 bg-surface/50">
      <div className="flex items-center gap-2.5 px-4 py-3.5">
        <Link
          href={
            isOwnPost ? ROUTES.PROFILE : ROUTES.CREATOR_PROFILE(post.creatorId)
          }
          aria-label={`View ${post.creatorFullName}'s profile`}
          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary-light to-primary p-0.5"
        >
          <div className="h-full w-full overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
            {post.creatorAvatarUrl ? (
              <Image
                src={post.creatorAvatarUrl}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-text-secondary/60">
                <User className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
          </div>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link
              href={
                isOwnPost
                  ? ROUTES.PROFILE
                  : ROUTES.CREATOR_PROFILE(post.creatorId)
              }
              className="font-sans text-sm font-semibold text-text-primary hover:text-primary-light"
            >
              {post.creatorFullName}
            </Link>
            <BadgeCheck
              className="h-[13px] w-[13px] shrink-0 text-primary"
              aria-hidden="true"
            />
            {post.isCreator && (
              <span className="rounded-sm bg-warning/16 px-1.5 py-0.5 font-sans text-[8px] font-semibold tracking-wide text-warning uppercase">
                Creator
              </span>
            )}
          </div>
          <div className="mt-0.5 font-sans text-[11px] font-light text-text-secondary/70">
            {post.creatorName} · {formatRelativeTime(post.createdAt)}
          </div>
        </div>
      </div>

      {(post.title || post.description) && (
        <div className="px-4 pb-3">
          {post.title && (
            <p className="font-sans text-sm font-semibold text-text-primary">
              {post.title}
            </p>
          )}
          {post.description && (
            <p className="mt-1 font-sans text-[13.5px] leading-relaxed text-text-primary/90">
              {post.description}
            </p>
          )}
        </div>
      )}

      {primaryMedia && (
        <div
          role="button"
          tabIndex={0}
          onClick={handleMediaClick}
          onDoubleClick={handleDoubleClick}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
          className="relative aspect-square cursor-pointer bg-surface select-none"
        >
          {primaryMedia.type === "video" && videoPlaying && primaryMedia.url ? (
            <video
              src={primaryMedia.url}
              poster={primaryMedia.thumbnailUrl ?? undefined}
              autoPlay
              playsInline
              controls
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : primaryMedia.thumbnailUrl ? (
            <Image
              src={primaryMedia.thumbnailUrl}
              alt=""
              fill
              sizes="640px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-text-secondary/40">
              <ImageOff className="h-8 w-8" aria-hidden="true" />
            </span>
          )}

          {primaryMedia.type === "video" && !videoPlaying && !isLocked && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
              <span className="pointer-events-none absolute top-1/2 left-1/2 flex h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm">
                <Play className="h-[26px] w-[26px]" aria-hidden="true" />
              </span>
            </>
          )}

          {primaryMedia.type === "video" && videoPlaying && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setVideoPlaying(false);
              }}
              aria-label="Pause video"
              className="pointer-events-auto absolute top-3 left-3 z-[2] flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white"
            >
              <Pause className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          {!isLocked && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxOpen(true);
              }}
              aria-label="View full size"
              className="pointer-events-auto absolute bottom-3 right-3 z-[2] flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
            >
              <Expand className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          {!isLocked && post.media.length > 1 && (
            <>
              {mediaIndex > 0 && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    goToMedia(mediaIndex - 1);
                  }}
                  aria-label="Previous media"
                  className="absolute top-1/2 left-3 z-[2] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              {mediaIndex < post.media.length - 1 && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    goToMedia(mediaIndex + 1);
                  }}
                  aria-label="Next media"
                  className="absolute top-1/2 right-3 z-[2] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              <span className="pointer-events-none absolute top-3 right-3 z-[2] rounded-full bg-black/50 px-2.5 py-1 font-sans text-[10.5px] font-semibold text-white backdrop-blur-sm">
                {mediaIndex + 1}/{post.media.length}
              </span>
              <div className="pointer-events-none absolute bottom-3 left-1/2 z-[2] flex -translate-x-1/2 gap-1.5">
                {post.media.map((item, index) => (
                  <span
                    key={item.id}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition",
                      index === mediaIndex ? "bg-white" : "bg-white/40",
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {heartVisible && (
            <span
              key={heartBurstKey}
              className="pointer-events-none absolute top-1/2 left-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 animate-[heartBurst_0.7s_ease-out]"
            >
              <svg
                width="90"
                height="90"
                viewBox="0 0 24 24"
                fill="#ff4d6d"
                aria-hidden="true"
              >
                <path d="M12 21l-1.5-1.4C5 15 2 12.3 2 8.9 2 6.2 4.1 4 6.9 4c1.6 0 3.1.7 4.1 1.9C12 4.7 13.5 4 15.1 4 17.9 4 20 6.2 20 8.9c0 3.4-3 6.1-8.5 10.7z" />
              </svg>
            </span>
          )}

          {isLocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/55 p-5 text-center backdrop-blur-2xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary-light/40 bg-secondary-light/18 text-secondary-light">
                <Lock className="h-[26px] w-[26px]" aria-hidden="true" />
              </span>
              <div className="mt-3 font-display text-lg font-semibold text-white">
                Subscriber-only content
              </div>
              <div className="mt-1 font-sans text-xs font-light text-text-secondary/75">
                Subscribe to {post.creatorFullName} to unlock this post
              </div>
              <Link
                href={ROUTES.SUBSCRIBE_PLANS(
                  post.creatorId,
                  post.creatorFullName,
                )}
                onClick={(event) => event.stopPropagation()}
                className="mt-3.5 flex items-center gap-1.5 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark px-5 py-2.5 font-sans text-[13px] font-semibold text-white shadow-[0_12px_26px_-12px_rgba(226,29,91,.7)]"
              >
                Subscribe to unlock
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              requireAuth(() => onToggleLike(post.id), "Sign in to like posts.")
            }
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-2 font-sans text-[12.5px] font-medium transition",
              post.likedByMe
                ? "border-secondary-light/35 bg-secondary-light/16 text-secondary-light"
                : "border-primary/16 bg-surface/60 text-text-secondary hover:bg-secondary-light/10",
            )}
          >
            <Heart
              className="h-[17px] w-[17px]"
              aria-hidden="true"
              fill={post.likedByMe ? "currentColor" : "none"}
            />
            {formatCount(post.likeCount)}
          </button>
          {post.commentsEnabled && (
            <button
              type="button"
              onClick={() =>
                requireAuth(
                  () => setCommentsOpen(true),
                  "Sign in to view and add comments.",
                )
              }
              className="flex items-center gap-1.5 rounded-full border border-primary/16 bg-surface/60 px-3.5 py-2 font-sans text-[12.5px] font-medium text-text-secondary transition hover:bg-primary/10"
            >
              <MessageSquare className="h-[17px] w-[17px]" aria-hidden="true" />
              {formatCount(post.commentCount)}
            </button>
          )}
          <button
            type="button"
            onClick={() => void handleShare(post)}
            aria-label="Share post"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/10"
          >
            <Share2 className="h-[17px] w-[17px]" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-2.5 font-sans text-[11px] font-light text-text-secondary/70">
          {formatCount(post.viewCount)} views
        </div>
      </div>

      {primaryMedia && (
        <MediaLightbox
          open={lightboxOpen}
          mediaType={primaryMedia.type}
          src={
            primaryMedia.type === "video"
              ? (primaryMedia.url ?? primaryMedia.thumbnailUrl)
              : primaryMedia.thumbnailUrl
          }
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <PostCommentsModal
        postId={post.id}
        commentCount={post.commentCount}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
      />
    </article>
  );
}
