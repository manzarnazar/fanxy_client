"use client";

import { useState } from "react";
import type { StoryItem } from "@/features/story-view/types/story-view.types";

const TRUNCATE_LENGTH = 90;

interface StoryCaptionProps {
  story: StoryItem;
}

export function StoryCaption({ story }: StoryCaptionProps) {
  const [expanded, setExpanded] = useState(false);
  const description = story.description ?? "";
  const isLong = description.length > TRUNCATE_LENGTH;
  const displayText = expanded || !isLong ? description : `${description.slice(0, TRUNCATE_LENGTH)}…`;

  if (!description) return null;

  return (
    <div className="absolute right-4 bottom-[78px] left-4 z-[6]">
      <p className="font-sans text-sm leading-relaxed font-light text-white [text-shadow:0_2px_8px_rgba(0,0,0,.6)]">
        {displayText}
        {isLong && (
          <button type="button" onClick={() => setExpanded((prev) => !prev)} className="ml-1.5 font-normal text-primary-light">
            {expanded ? "less" : "more"}
          </button>
        )}
      </p>
    </div>
  );
}
