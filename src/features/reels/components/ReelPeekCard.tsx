import { ChevronDown, ChevronUp } from "lucide-react";
import type { Reel } from "@/features/reels/types/reels.types";

interface ReelPeekCardProps {
  reel: Reel;
  direction: "prev" | "next";
  onClick: () => void;
}

export function ReelPeekCard({ reel, direction, onClick }: ReelPeekCardProps) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${isPrev ? "Previous" : "Next"} reel: ${reel.creatorFullName}`}
      className="group relative flex h-[66px] w-full max-w-[330px] scale-[.96] items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-primary-dark to-surface-elevated opacity-55 transition hover:scale-[.98] hover:opacity-85"
    >
      <div className="absolute inset-0 flex items-center justify-center gap-2 font-sans text-xs font-medium text-text-secondary">
        {isPrev && <ChevronUp className="h-[15px] w-[15px]" aria-hidden="true" />}
        {isPrev ? "Previous" : "Next"} · {reel.creatorFullName}
        {!isPrev && <ChevronDown className="h-[15px] w-[15px]" aria-hidden="true" />}
      </div>
    </button>
  );
}
