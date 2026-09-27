import { SquarePen } from "lucide-react";
import { MessagesMoreMenu } from "@/features/messages/components/MessagesMoreMenu";

interface MessagesHeaderBarProps {
  totalUnread: number;
  onlineCount: number;
  showArchived: boolean;
  onOpenNewChat: () => void;
  onToggleArchived: () => void;
  onMarkAllRead: () => void;
}

export function MessagesHeaderBar({
  totalUnread,
  onlineCount,
  showArchived,
  onOpenNewChat,
  onToggleArchived,
  onMarkAllRead,
}: MessagesHeaderBarProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-[28px] leading-none font-semibold text-text-primary">Messages</h1>
        <div className="mt-1 flex items-center gap-2.5">
          <span className="font-sans text-[11.5px] font-normal text-danger">{totalUnread} unread</span>
          <span className="h-[3px] w-[3px] rounded-full bg-text-secondary/30" />
          <span className="flex items-center gap-1.5 font-sans text-[11.5px] font-normal text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            {onlineCount} online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenNewChat}
          title="New message"
          aria-label="New message"
          className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-primary-light to-primary text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
        >
          <SquarePen className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <MessagesMoreMenu showArchived={showArchived} onMarkAllRead={onMarkAllRead} onToggleArchived={onToggleArchived} />
      </div>
    </div>
  );
}
