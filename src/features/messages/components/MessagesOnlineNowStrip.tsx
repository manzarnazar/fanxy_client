import Image from "next/image";
import { User } from "lucide-react";
import type { Conversation } from "@/features/messages/types/messages.types";

interface MessagesOnlineNowStripProps {
  onlineFriends: Conversation[];
  onSelect: (conversation: Conversation) => void;
}

export function MessagesOnlineNowStrip({ onlineFriends, onSelect }: MessagesOnlineNowStripProps) {
  if (onlineFriends.length === 0) return null;

  return (
    <div className="border-b border-primary/10 px-1 pt-1 pb-3">
      <div className="mb-2 px-2 font-sans text-[10px] font-medium tracking-[1.2px] text-text-muted uppercase">
        Online now · {onlineFriends.length}
      </div>
      <div className="flex gap-3.5 overflow-x-auto px-2">
        {onlineFriends.map((friend) => (
          <button
            key={friend.id}
            type="button"
            onClick={() => onSelect(friend)}
            className="flex shrink-0 flex-col items-center gap-1 transition hover:-translate-y-0.5"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-surface-elevated">
              {friend.avatarUrl ? (
                <Image src={friend.avatarUrl} alt="" width={40} height={40} className="h-full w-full rounded-full object-cover" />
              ) : (
                <User className="h-4.5 w-4.5 text-text-secondary/60" aria-hidden="true" />
              )}
              <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
            </span>
            <span className="max-w-14 truncate font-sans text-[10.5px] font-normal text-text-secondary/85">{friend.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
