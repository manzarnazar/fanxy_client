import Image from "next/image";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import type { StoryNeighbor } from "@/features/story-view/types/story-view.types";

interface StoryNeighborPreviewProps {
  neighbor: StoryNeighbor;
  direction: "prev" | "next";
  onClick: () => void;
}

export function StoryNeighborPreview({ neighbor, direction, onClick }: StoryNeighborPreviewProps) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden w-[132px] shrink-0 flex-col items-center gap-2.5 opacity-75 transition hover:-translate-y-1 hover:opacity-100 xl:flex"
    >
      <div className="relative flex h-[200px] w-[132px] items-end justify-center overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-primary-dark to-surface-elevated">
        <div className="absolute right-0 bottom-3 left-0 flex flex-col items-center gap-1.5">
          <div className="relative h-11 w-11 overflow-hidden rounded-full bg-[conic-gradient(from_120deg,#7fd4f5,#c1a3ff,#ff5b78,#e8cf85,#7fd4f5)] p-0.5">
            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
              {neighbor.avatarUrl ? (
                <Image src={neighbor.avatarUrl} alt="" fill sizes="44px" className="object-cover" />
              ) : (
                <User className="h-5 w-5 text-text-secondary/60" aria-hidden="true" />
              )}
            </span>
          </div>
          <span className="font-sans text-[11px] font-medium text-white">{neighbor.name}</span>
        </div>
      </div>
      <span className="flex items-center gap-1 font-sans text-[11px] font-normal text-white/60">
        {isPrev && <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />}
        {isPrev ? "Previous" : "Next"}
        {!isPrev && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
      </span>
    </button>
  );
}
