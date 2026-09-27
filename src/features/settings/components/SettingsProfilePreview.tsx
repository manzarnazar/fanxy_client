import Image from "next/image";
import { BadgeCheck, Eye, User } from "lucide-react";
import type { SettingsProfile, UpdateProfileInput } from "@/features/settings/types/settings.types";

interface SettingsProfilePreviewProps {
  profile: SettingsProfile;
  form: UpdateProfileInput;
  avatarPreviewUrl: string | null;
  coverPreviewUrl: string | null;
}

/** Live "how others see you" card that tracks the editor's unsaved state. */
export function SettingsProfilePreview({ profile, form, avatarPreviewUrl, coverPreviewUrl }: SettingsProfilePreviewProps) {
  const avatarSrc = avatarPreviewUrl ?? profile.avatarUrl;
  const coverSrc = coverPreviewUrl ?? profile.coverImageUrl;

  return (
    <div className="overflow-hidden rounded-[20px] border border-primary/14 bg-surface/50">
      <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-3">
        <Eye className="h-4 w-4 text-primary-light" aria-hidden="true" />
        <span className="font-display text-[15px] font-semibold text-text-primary">Live preview</span>
        <span className="ml-auto font-sans text-[10px] font-light text-text-secondary/60">How others see you</span>
      </div>

      <div className="relative  h-[92px] bg-surface-elevated">
        {coverSrc ? (
          <Image src={coverSrc} alt="" fill sizes="300px" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(120%_150%_at_30%_-20%,#0b3f5c_0%,#07293f_55%,#041a29_100%)]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-surface/90" />
      </div>

      <div className="-mt-8 px-4 pb-4">
        <div className="relative z-10 h-16 w-16 rounded-full bg-gradient-to-br from-primary-light to-primary p-0.5">
          <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
            {avatarSrc ? (
              <Image src={avatarSrc} alt="" width={60} height={60} className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-text-secondary/60" aria-hidden="true" />
            )}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <span className="truncate font-display text-[17px] font-semibold text-text-primary">
            {form.fullName || profile.fullName}
          </span>
          {profile.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}
        </div>
        <div className="font-sans text-[11.5px] font-light text-text-secondary/70">
          {form.username || profile.username}
        </div>

        {(form.bio || profile.bio) && (
          <p className="mt-2 line-clamp-3 font-sans text-[12px] leading-relaxed font-light text-text-secondary">
            {form.bio || profile.bio}
          </p>
        )}
      </div>
    </div>
  );
}
