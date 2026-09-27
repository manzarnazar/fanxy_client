"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";
import type { Reel } from "@/features/reels/types/reels.types";

interface ReelInfoPanelProps {
  reel: Reel;
}

export function ReelInfoPanel({ reel }: ReelInfoPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const description = reel.description ?? "";
  const isLong = description.length > 140;

  return (
    <div className="mt-6.5 rounded-xl border border-primary/13 bg-surface/40 p-5.5">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-2xl leading-tight font-semibold text-text-primary">{reel.title}</h2>
        <div className="flex shrink-0 items-center gap-3.5 pt-1">
          <span className="flex items-center gap-1.5 font-sans text-[12.5px] font-light text-text-secondary">
            <Eye className="h-[15px] w-[15px] text-primary-light" aria-hidden="true" />
            {formatCount(reel.viewCount)} views
          </span>
        </div>
      </div>

      {description && (
        <>
          <p className={`mt-3 font-sans text-sm leading-relaxed font-light text-text-secondary ${expanded ? "" : "line-clamp-2"}`}>
            {description}
          </p>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-1.5 font-sans text-[12.5px] font-medium text-primary-light hover:text-primary"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
