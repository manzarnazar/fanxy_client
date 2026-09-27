import { Archive, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MessagesConversationRow } from "@/features/messages/components/MessagesConversationRow";
import type { Conversation } from "@/features/messages/types/messages.types";

interface MessagesArchivedSectionProps {
  archived: Conversation[];
  archivedOpen: boolean;
  onToggle: () => void;
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  onMarkRead: (conversation: Conversation) => void;
  onTogglePin: (conversation: Conversation) => void;
  onToggleMute: (conversation: Conversation) => void;
  onToggleArchive: (conversation: Conversation) => void;
  onBlock: (conversation: Conversation) => void;
}

export function MessagesArchivedSection({
  archived,
  archivedOpen,
  onToggle,
  selectedId,
  onSelect,
  onMarkRead,
  onTogglePin,
  onToggleMute,
  onToggleArchive,
  onBlock,
}: MessagesArchivedSectionProps) {
  if (archived.length === 0) return null;

  return (
    <div className="mt-3.5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2.5 rounded-xl border border-primary/10 bg-surface/40 p-2.5 transition hover:bg-primary/8"
      >
        <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary-light">
          <Archive className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="flex-1 text-left">
          <div className="font-sans text-[13px] font-medium text-text-primary">Archived</div>
          <div className="font-sans text-[10.5px] font-light text-text-secondary/60">{archived.length} conversations</div>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 text-text-secondary transition-transform", archivedOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {archivedOpen && (
        <div className="mt-1.5 flex flex-col gap-1">
          {archived.map((conversation) => (
            <MessagesConversationRow
              key={conversation.id}
              conversation={conversation}
              isArchivedRow
              selected={selectedId === conversation.id}
              onSelect={() => onSelect(conversation)}
              onMarkRead={() => onMarkRead(conversation)}
              onTogglePin={() => onTogglePin(conversation)}
              onToggleMute={() => onToggleMute(conversation)}
              onToggleArchive={() => onToggleArchive(conversation)}
              onBlock={() => onBlock(conversation)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
