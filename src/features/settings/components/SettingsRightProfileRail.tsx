import Image from "next/image";
import { BadgeCheck, Crown, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SettingsProfile } from "@/features/settings/types/settings.types";

interface SettingsRightProfileRailProps {
  profile: SettingsProfile;
}

export function SettingsRightProfileRail({ profile }: SettingsRightProfileRailProps) {
  return (
    <aside className="hidden h-full w-[314px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-primary/10 px-4.5 py-5.5 xl:flex">
      <div className="flex flex-col items-center rounded-xl border border-primary/14 bg-surface/50 p-5 text-center">
        <div className="h-18 w-18 rounded-full bg-gradient-to-br from-primary-light to-primary p-1">
          <div className="h-full w-full overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
            {profile.avatarUrl ? (
              <Image src={profile.avatarUrl} alt="" width={72} height={72} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-text-secondary/60">
                <User className="h-7 w-7" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <span className="font-display text-base font-semibold text-text-primary">{profile.fullName}</span>
          {profile.verified && <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />}
        </div>
        <div className="font-sans text-[12px] font-light text-text-secondary/70">{profile.username}</div>

        <span
          className={cn(
            "mt-3 flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-[11px] font-semibold",
            profile.isCreator
              ? "border-accent-gold/32 bg-accent-gold/14 text-accent-gold-light"
              : "border-primary/28 bg-primary/12 text-primary-light",
          )}
        >
          {profile.isCreator ? <Crown className="h-3.5 w-3.5" aria-hidden="true" /> : <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />}
          {profile.isCreator ? "VIP Creator" : "Standard member"}
        </span>
      </div>
    </aside>
  );
}
