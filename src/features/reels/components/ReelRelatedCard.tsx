import Image from "next/image";
import { Heart, Eye, Lock, User } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";
import type { Reel } from "@/features/reels/types/reels.types";

interface ReelRelatedCardProps {
  reel: Reel;
  onClick: () => void;
}

export function ReelRelatedCard({ reel, onClick }: ReelRelatedCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-[230px] w-[172px] shrink-0 overflow-hidden rounded-xl border border-primary/14 bg-gradient-to-br from-primary-dark to-surface-elevated shadow-[0_14px_30px_-22px_rgba(0,0,0,.7)] transition hover:-translate-y-1.5 hover:border-primary/35"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/90" />
      {reel.locked && (
        <span className="absolute top-2.5 left-2.5 flex h-6 w-6 items-center justify-center rounded-md bg-secondary/85">
          <Lock className="h-3 w-3 text-white" aria-hidden="true" />
        </span>
      )}
      <div className="absolute right-2.5 bottom-2.5 left-2.5 text-left">
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="relative h-[22px] w-[22px] shrink-0 overflow-hidden rounded-full border border-primary/40 bg-surface-elevated">
            {reel.creatorAvatarUrl ? (
              <Image src={reel.creatorAvatarUrl} alt="" fill sizes="22px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-text-secondary/60">
                <User className="h-3 w-3" aria-hidden="true" />
              </span>
            )}
          </span>
          <span className="truncate font-sans text-[11px] font-medium text-white">{reel.creatorFullName}</span>
        </div>
        <div className="flex items-center gap-2.5 font-sans text-[10.5px] font-light text-white/85">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {formatCount(reel.viewCount)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 fill-live text-live" aria-hidden="true" />
            {formatCount(reel.likeCount)}
          </span>
        </div>
      </div>
    </button>
  );
}
