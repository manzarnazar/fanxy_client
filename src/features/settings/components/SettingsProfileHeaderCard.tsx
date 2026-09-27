import { useRef } from "react";
import Image from "next/image";
import { BadgeCheck, Camera, Crown, Image as ImageIcon, Trash2, User } from "lucide-react";
import { SettingsCompletionRing } from "@/features/settings/components/SettingsCompletionRing";
import { computeProfileCompletionPercent } from "@/features/settings/utils/profileCompletion";
import type { SettingsProfile } from "@/features/settings/types/settings.types";

interface SettingsProfileHeaderCardProps {
  profile: SettingsProfile;
  avatarPreviewUrl: string | null;
  coverPreviewUrl: string | null;
  onAvatarChange: (file: File | null) => void;
  onCoverChange: (file: File | null) => void;
}

export function SettingsProfileHeaderCard({
  profile,
  avatarPreviewUrl,
  coverPreviewUrl,
  onAvatarChange,
  onCoverChange,
}: SettingsProfileHeaderCardProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const completion = computeProfileCompletionPercent(profile);
  const coverSrc = coverPreviewUrl ?? profile.coverImageUrl;
  const avatarSrc = avatarPreviewUrl ?? profile.avatarUrl;

  return (
    <div className="overflow-hidden rounded-[24px] border border-primary/14 bg-surface/50">
      {/* Cover */}
      <div className="relative h-[140px] w-full">
        {coverSrc ? (
          <Image src={coverSrc} alt="" fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary-dark to-surface-elevated" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/80" />

        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-xl border border-primary/20 bg-surface/55 px-3.5 py-2 font-sans text-[12px] font-medium text-text-primary backdrop-blur-md transition hover:bg-primary/14"
        >
          <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Change Cover
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => onCoverChange(event.target.files?.[0] ?? null)}
        />
      </div>

      <div className="px-5.5 pb-5.5">
        {/* Only the avatar overlaps the cover — identity flows below, ring stays clear on the right. */}
        <div className="flex items-end justify-between gap-3.5">
          <div className="relative -mt-[46px] h-[96px] w-[96px] shrink-0 rounded-full bg-gradient-to-br from-primary-light to-primary p-[3px] shadow-[0_0_0_4px_var(--color-surface-elevated)]">
            <div className="h-full w-full overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
              {avatarSrc ? (
                <Image src={avatarSrc} alt="" width={90} height={90} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-text-secondary/60">
                  <User className="h-9 w-9" aria-hidden="true" />
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Change avatar"
              className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-elevated bg-gradient-to-br from-primary-light to-primary text-[#03283a] transition motion-safe:hover:scale-110"
            >
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => onAvatarChange(event.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex shrink-0 flex-col items-center">
            <SettingsCompletionRing percent={completion} />
            <span className="mt-0.5 font-sans text-[10px] font-light text-text-secondary/55">Complete</span>
          </div>
        </div>

        {/* Identity */}
        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[24px] leading-tight font-semibold text-text-primary">
              {profile.fullName}
            </span>
            {profile.verified && <BadgeCheck className="h-[18px] w-[18px] shrink-0 text-primary" aria-hidden="true" />}
            {profile.isCreator && (
              <span className="flex items-center gap-1 rounded-lg border border-secondary-light/30 bg-gradient-to-br from-secondary/20 to-secondary-light/12 px-2.5 py-[3px] font-sans text-[9px] font-semibold tracking-[0.4px] text-[#ff9caa] uppercase">
                <Crown className="h-3 w-3" aria-hidden="true" />
                Creator
              </span>
            )}
          </div>
          <div className="mt-1 font-sans text-[13px] font-light text-text-secondary/70">{profile.username}</div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-[11px] border border-primary/20 bg-surface-elevated/70 px-3.5 py-2 font-sans text-[12px] font-medium text-text-primary transition hover:bg-primary/12"
            >
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              Change Avatar
            </button>
            {avatarSrc && (
              <button
                type="button"
                onClick={() => onAvatarChange(null)}
                className="flex items-center gap-1.5 rounded-[11px] border border-danger/25 bg-danger/8 px-3.5 py-2 font-sans text-[12px] font-medium text-[#ff9caa] transition hover:bg-danger/16"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Remove Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
