import Image from "next/image";
import Link from "next/link";
import { Check, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import type { StoryCreator } from "@/features/story-view/types/story-view.types";

interface StoryCreatorCardProps {
  creator: StoryCreator;
  followedByMe: boolean;
  onToggleFollow: () => void;
}

export function StoryCreatorCard({ creator, followedByMe, onToggleFollow }: StoryCreatorCardProps) {
  return (
    <div className="absolute bottom-6.5 left-6.5 z-[35] hidden w-[280px] rounded-2xl border border-primary/20 bg-surface-elevated/55 p-4 shadow-[0_22px_50px_-24px_rgba(0,0,0,.8)] backdrop-blur-xl lg:block">
      <div className="flex items-center gap-2.5">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary-light to-primary p-0.5">
          <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
            {creator.avatarUrl ? (
              <Image src={creator.avatarUrl} alt="" fill sizes="48px" className="object-cover" />
            ) : (
              <User className="h-5 w-5 text-text-secondary/60" aria-hidden="true" />
            )}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <span className="truncate font-display text-base font-semibold text-white">{creator.name}</span>
          <div className="font-sans text-[11px] font-light text-white/70">{creator.username}</div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onToggleFollow}
          className={cn(
            "flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-md font-sans text-xs font-semibold transition hover:-translate-y-0.5",
            followedByMe ? "border border-primary/25 bg-surface/70 text-primary-light" : "bg-gradient-to-br from-primary-light to-primary text-[#03283a]",
          )}
        >
          {followedByMe ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
          {followedByMe ? "Following" : "Follow"}
        </button>
        <Link
          href={ROUTES.CREATOR_PROFILE(creator.id)}
          className="flex h-[38px] flex-1 items-center justify-center rounded-md border border-primary/20 bg-surface/70 font-sans text-xs font-medium text-white transition hover:bg-primary/12"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}
