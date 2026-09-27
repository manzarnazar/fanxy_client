import { Crown, Flag, Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import type { Reel } from "@/features/reels/types/reels.types";

interface ReelActionBarProps {
  reel: Reel;
  onToggleLike: () => void;
  onOpenComments: () => void;
  onOpenShare: () => void;
  onToggleSubscribe: () => void;
  onOpenReport: () => void;
}

export function ReelActionBar({
  reel,
  onToggleLike,
  onOpenComments,
  onOpenShare,
  onToggleSubscribe,
  onOpenReport,
}: ReelActionBarProps) {
  return (
    <div className="flex flex-col items-center gap-3.5 rounded-xl border border-primary/14 bg-surface-elevated/50 p-3.5 shadow-[0_24px_50px_-30px_rgba(0,0,0,.8)] backdrop-blur-md">
      <ActionButton
        icon={<Heart className={cn("h-[21px] w-[21px]", reel.likedByMe && "fill-current")} aria-hidden="true" />}
        label={formatCount(reel.likeCount)}
        active={reel.likedByMe}
        activeClassName="bg-live/16 border-live/40 text-live"
        onClick={onToggleLike}
        ariaLabel={reel.likedByMe ? "Unlike reel" : "Like reel"}
      />
      <ActionButton
        icon={<MessageCircle className="h-[21px] w-[21px]" aria-hidden="true" />}
        label={formatCount(reel.commentCount)}
        onClick={onOpenComments}
        ariaLabel="Open comments"
      />
      <ActionButton
        icon={<Share2 className="h-[21px] w-[21px]" aria-hidden="true" />}
        label="Share"
        onClick={onOpenShare}
        ariaLabel="Share reel"
      />
      <ActionButton
        icon={<Crown className="h-[21px] w-[21px]" aria-hidden="true" />}
        label={reel.subscribedByMe ? "Subbed" : "Sub"}
        active={reel.subscribedByMe}
        activeClassName="bg-secondary/18 border-secondary-light/40 text-secondary-light"
        onClick={onToggleSubscribe}
        ariaLabel={reel.subscribedByMe ? "Unsubscribe from creator" : "Subscribe to creator"}
      />
      <ActionButton
        icon={<Flag className="h-[21px] w-[21px]" aria-hidden="true" />}
        label="Report"
        onClick={onOpenReport}
        ariaLabel="Report reel"
      />
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  activeClassName?: string;
  disabled?: boolean;
  ariaLabel: string;
}

function ActionButton({ icon, label, onClick, active, activeClassName, disabled, ariaLabel }: ActionButtonProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border border-white/14 bg-white/8 text-white transition hover:-translate-y-0.5 hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0",
          active && activeClassName,
        )}
      >
        {icon}
      </button>
      <span className={cn("font-sans text-[10.5px] font-medium text-text-secondary", active && activeClassName)}>
        {label}
      </span>
    </div>
  );
}
