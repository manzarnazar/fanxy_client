import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import type { NotificationItem } from "@/features/notifications/types/notifications.types";

interface NotificationListItemProps {
  item: NotificationItem;
  onOpen: () => void;
}

export function NotificationListItem({ item, onOpen }: NotificationListItemProps) {
  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleRowKeyDown}
      className="relative flex cursor-pointer items-start gap-3.5 rounded-xl border border-primary/10 bg-surface/45 p-3.5 transition hover:border-primary/35 hover:translate-x-0.5"
    >
      <div className="shrink-0">
        <div className="flex h-11.5 w-11.5 items-center justify-center overflow-hidden rounded-full border-2 border-surface-elevated bg-border">
          {item.actorAvatarUrl ? (
            <Image src={item.actorAvatarUrl} alt="" width={44} height={44} className="h-full w-full object-cover" />
          ) : (
            <Bell className="h-5 w-5 text-text-secondary/60" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-sans text-[13px] leading-snug text-text-secondary/90">
          <span className="font-semibold text-text-primary">{item.actorName}</span> {item.title ?? item.message}
        </div>

        <div className="mt-1">
          <span className="font-sans text-[10.5px] font-light text-text-secondary/60">{item.timeLabel}</span>
        </div>

        {item.postId && item.postImageUrl && (
          <Link
            href={`/reels/${item.postId}`}
            onClick={(event) => event.stopPropagation()}
            className="mt-2.5 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-surface/70 px-2 py-1.5"
          >
            <span className="h-8 w-8 shrink-0 overflow-hidden rounded-md">
              <Image src={item.postImageUrl} alt="" width={32} height={32} className="h-full w-full object-cover" />
            </span>
            {item.postTitle && (
              <span className="max-w-[160px] truncate font-sans text-[11.5px] font-medium text-text-secondary">
                {item.postTitle}
              </span>
            )}
          </Link>
        )}
      </div>
    </div>
  );
}
