import { cn } from "@/lib/utils/cn";
import { CONVERSATION_FILTERS } from "@/features/messages/constants/messages";
import type { Conversation, ConversationFilterKey } from "@/features/messages/types/messages.types";

interface MessagesFilterChipsProps {
  conversations: Conversation[];
  activeFilter: ConversationFilterKey;
  onSelect: (filter: ConversationFilterKey) => void;
}

function countFor(conversations: Conversation[], filter: ConversationFilterKey): number {
  switch (filter) {
    case "unread":
      return conversations.filter((conversation) => conversation.unread).length;
    case "pinned":
      return conversations.filter((conversation) => conversation.pinned).length;
    default:
      return 0;
  }
}

export function MessagesFilterChips({ conversations, activeFilter, onSelect }: MessagesFilterChipsProps) {
  return (
    <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
      {CONVERSATION_FILTERS.map((filter) => {
        const isActive = activeFilter === filter.key;
        const count = countFor(conversations, filter.key);

        return (
          <button
            key={filter.key}
            type="button"
            onClick={() => onSelect(filter.key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-sans text-[12px] font-medium whitespace-nowrap transition",
              isActive
                ? "border-transparent bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
                : "border-primary/18 bg-surface/60 text-text-secondary/85 hover:bg-primary/10",
            )}
          >
            {filter.label}
            {count > 0 && (
              <span
                className={cn(
                  "flex h-4 min-w-4 items-center justify-center rounded-md px-1 font-sans text-[9px] font-semibold",
                  isActive ? "bg-[#03283a]/20 text-[#03283a]" : "bg-live/18 text-live",
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
