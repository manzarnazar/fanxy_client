"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AtSign,
  BadgeCheck,
  Ban,
  Check,
  Copy,
  ImageIcon,
  Loader2,
  Lock,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  PlaySquare,
  Share2,
  Sparkles,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { formatCount } from "@/lib/formatter/count";
import { ROUTES } from "@/lib/constants/routes";
import type { CreatorProfile, CreatorSocialPlatform } from "@/features/creator-profile/types/creator-profile.types";

// lucide-react dropped brand glyphs, so these mirror the neutral stand-ins
// used by SettingsSocialLinksForm (ImageIcon=Instagram, Users=Facebook, ...).
const SOCIAL_ICONS: Record<CreatorSocialPlatform, LucideIcon> = {
  instagram: ImageIcon,
  facebook: Users,
  youtube: PlaySquare,
  x: AtSign,
};

interface CreatorProfileHeroProps {
  profile: CreatorProfile;
  postCount: number;
  onMessage: () => void;
  messagePending: boolean;
  onShare: () => void;
  onCopyLink: () => void;
  onToggleBlock: () => void;
  blockPending: boolean;
}

export function CreatorProfileHero({
  profile,
  postCount,
  onMessage,
  messagePending,
  onShare,
  onCopyLink,
  onToggleBlock,
  blockPending,
}: CreatorProfileHeroProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnchorRef = useRef<HTMLButtonElement | null>(null);

  // Mirrors the Flutter gate (otherprofile.dart): the Message button is hidden
  // for creators unless the viewer's package includes chat access.
  const canMessage = !profile.isCreator || (profile.subscribed && profile.canChat);
  const memberSinceYear = profile.memberSince ? new Date(profile.memberSince).getFullYear() : null;

  return (
    <section className="relative rounded-2xl border border-primary/16 bg-surface-elevated shadow-card">
      <div className="relative h-[200px] overflow-hidden rounded-t-2xl bg-surface">
        {profile.coverUrl ? (
          <Image src={profile.coverUrl} alt="" fill sizes="720px" className="object-cover" priority />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/25 via-surface to-surface-elevated" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-surface/10 via-surface-elevated/40 to-surface-elevated" />
      </div>

      <div className="relative rounded-b-2xl px-5 pb-5 sm:px-6">
        <div className="-mt-12 flex flex-wrap items-end justify-between gap-3">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary-light to-primary p-[3px] shadow-[0_0_0_5px_var(--color-surface-elevated)]">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                width={96}
                height={96}
                className="h-full w-full rounded-full border-[3px] border-surface object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-surface bg-surface">
                <UserRound className="h-10 w-10 text-text-muted" aria-hidden="true" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pb-1">
            <button
              ref={menuAnchorRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="More options"
              className="flex h-9.5 w-9.5 items-center justify-center rounded-full border border-primary/20 bg-surface text-text-secondary transition-colors hover:border-primary/40 hover:text-text-primary"
            >
              <MoreHorizontal className="h-4.5 w-4.5" aria-hidden="true" />
            </button>

            <DropdownMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              anchorRef={menuAnchorRef}
              ariaLabel="Profile options"
              panelClassName="w-52 overflow-hidden rounded-xl border border-primary/16 bg-surface-elevated py-1.5 shadow-dropdown"
            >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onShare();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-sans text-[13px] text-text-primary hover:bg-primary/8"
                >
                  <Share2 className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                  Share profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onCopyLink();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-sans text-[13px] text-text-primary hover:bg-primary/8"
                >
                  <Copy className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                  Copy link
                </button>
                {/* The backend only allows blocking users you're subscribed to
                    (mirrors the Flutter gate). */}
                {profile.subscribed && (
                  <button
                    type="button"
                    role="menuitem"
                    disabled={blockPending}
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleBlock();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-sans text-[13px] text-live hover:bg-live/8 disabled:opacity-60"
                  >
                    <Ban className="h-4 w-4" aria-hidden="true" />
                    {profile.blocked ? "Unblock user" : "Block user"}
                  </button>
                )}
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <h1 className="font-display text-[26px] leading-none font-semibold text-text-primary">{profile.name}</h1>
            {profile.verified && <BadgeCheck className="h-5 w-5 text-primary" aria-hidden="true" />}
            {profile.isCreator && (
              <span className="flex items-center gap-1 rounded-md border border-accent-gold/35 bg-accent-gold/12 px-2 py-1 font-sans text-[9px] font-semibold tracking-wide text-accent-gold uppercase">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Creator
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-3 font-sans text-[12.5px] font-light text-text-secondary">
            <span>@{profile.username}</span>
            {profile.countryName && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {profile.countryName}
              </span>
            )}
            {memberSinceYear && <span>Joined {memberSinceYear}</span>}
          </div>

          {profile.bio && (
            <p className="mt-3 font-sans text-[13.5px] leading-relaxed font-light whitespace-pre-line text-text-secondary">
              {profile.bio}
            </p>
          )}

          {profile.socialLinks.length > 0 && (
            <div className="mt-3.5 flex items-center gap-2">
              {profile.socialLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.platform];
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${profile.name} on ${link.platform}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/16 bg-surface text-text-secondary transition-colors hover:border-primary/40 hover:text-primary-light"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4.5 flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-primary/13 bg-surface/50 px-5 py-2.5 text-center">
            <div className="font-display text-[20px] leading-none font-semibold text-text-primary">
              {formatCount(postCount)}
            </div>
            <div className="mt-1 font-sans text-[10px] font-light text-text-muted">Posts</div>
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-2.5">
            {profile.isCreator &&
              (profile.subscribed ? (
                <span className="flex items-center gap-1.5 rounded-md border border-success/35 bg-success/12 px-4 py-2.5 font-sans text-[12.5px] font-semibold text-success">
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Subscribed
                </span>
              ) : (
                <Link
                  href={ROUTES.SUBSCRIBE_PLANS(profile.id, profile.name)}
                  className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-primary-light to-primary px-5 py-2.5 font-sans text-[12.5px] font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
                >
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Subscribe
                </Link>
              ))}

            {canMessage && (
              <button
                type="button"
                onClick={onMessage}
                disabled={messagePending}
                className="flex items-center gap-1.5 rounded-md border border-primary/25 bg-surface px-4.5 py-2.5 font-sans text-[12.5px] font-semibold text-text-primary transition-colors hover:border-primary/50 disabled:opacity-60"
              >
                {messagePending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                )}
                Message
              </button>
            )}

            {profile.isCreator && (
              <Link
                href={ROUTES.LEADERBOARD_TOP_FANS(profile.id, profile.name)}
                className="flex items-center gap-1.5 rounded-md border border-accent-gold/35 bg-accent-gold/10 px-4.5 py-2.5 font-sans text-[12.5px] font-semibold text-accent-gold transition-colors hover:bg-accent-gold/16"
              >
                <Trophy className="h-4 w-4" aria-hidden="true" />
                Top Fans
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
