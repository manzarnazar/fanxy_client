import Image from "next/image";
import Link from "next/link";
import { Plus, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import type { StoryGroup } from "@/features/home/types/home.types";

interface HomeStoriesProps {
  stories: StoryGroup[];
  isCreator: boolean;
}

export function HomeStories({ stories, isCreator }: HomeStoriesProps) {
  if (stories.length === 0 && !isCreator) return null;

  return (
    <div className="flex gap-3.5 overflow-x-auto pb-1">
      {isCreator && (
        <Link
          href={ROUTES.UPLOAD_STORY}
          className="flex shrink-0 flex-col items-center gap-1.5 transition hover:-translate-y-0.5"
        >
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-dashed border-primary/40 bg-surface/60 text-primary-light">
            <Plus className="h-[26px] w-[26px]" aria-hidden="true" />
          </div>
          <span className="font-sans text-[11px] font-normal text-text-secondary/85">Your Story</span>
        </Link>
      )}

      {stories.map((group) => {
        const allViewed = group.items.every((item) => item.viewed);
        return (
          <Link
            key={group.creatorId}
            href={ROUTES.STORY_VIEW(group.creatorName)}
            className="flex shrink-0 flex-col items-center gap-1.5 transition hover:-translate-y-0.5"
          >
            <div
              className={cn(
                "relative h-[72px] w-[72px] rounded-full p-[3px]",
                allViewed ? "bg-text-secondary/25" : "bg-[conic-gradient(from_45deg,#7fd4f5,#c1a3ff,#ff5b78,#e8cf85,#7fd4f5)]",
              )}
            >
              <div className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-surface">
                {group.avatarUrl ? (
                  <Image src={group.avatarUrl} alt="" fill sizes="72px" className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-surface-elevated text-text-secondary/60">
                    <User className="h-6 w-6" aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>
            <span
              className={cn(
                "max-w-[74px] truncate font-sans text-[11px] font-normal",
                allViewed ? "text-text-muted" : "text-text-secondary/90",
              )}
            >
              {group.creatorFullName}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
