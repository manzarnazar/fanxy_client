import { MessagesConversationRow } from "@/features/messages/components/MessagesConversationRow";
import { MessagesConversationsSkeleton } from "@/features/messages/components/MessagesConversationsSkeleton";
import { MessagesEmptyState } from "@/features/messages/components/MessagesEmptyState";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import type { Conversation } from "@/features/messages/types/messages.types";

interface MessagesConversationListProps {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pinnedConversations: Conversation[];
  restConversations: Conversation[];
  noResults: boolean;
  isEmptyInbox: boolean;
  isFilteredView: boolean;
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  onMarkRead: (conversation: Conversation) => void;
  onTogglePin: (conversation: Conversation) => void;
  onToggleMute: (conversation: Conversation) => void;
  onToggleArchive: (conversation: Conversation) => void;
  onBlock: (conversation: Conversation) => void;
  onClearFilters: () => void;
  onStartNewChat: () => void;
}

export function MessagesConversationList({
  status,
  error,
  pinnedConversations,
  restConversations,
  noResults,
  isEmptyInbox,
  isFilteredView,
  selectedId,
  onSelect,
  onMarkRead,
  onTogglePin,
  onToggleMute,
  onToggleArchive,
  onBlock,
  onClearFilters,
  onStartNewChat,
}: MessagesConversationListProps) {
  if ((status === "loading" || status === "idle") && pinnedConversations.length === 0 && restConversations.length === 0) {
    return <MessagesConversationsSkeleton />;
  }

  if (status === "failed") {
    return (
      <SectionStateMessage
        variant="error"
        title="Couldn't load conversations"
        body={error ?? "Something went wrong. Please try again."}
        minHeightClassName="min-h-[320px]"
      />
    );
  }

  if (noResults || isEmptyInbox) {
    return (
      <MessagesEmptyState
        variant={isEmptyInbox ? "empty" : "noResults"}
        onClearFilters={onClearFilters}
        onStartNewChat={onStartNewChat}
      />
    );
  }

  const renderRow = (conversation: Conversation) => (
    <MessagesConversationRow
      key={conversation.id}
      conversation={conversation}
      selected={selectedId === conversation.id}
      onSelect={() => onSelect(conversation)}
      onMarkRead={() => onMarkRead(conversation)}
      onTogglePin={() => onTogglePin(conversation)}
      onToggleMute={() => onToggleMute(conversation)}
      onToggleArchive={() => onToggleArchive(conversation)}
      onBlock={() => onBlock(conversation)}
    />
  );

  return (
    <div className="flex flex-col gap-4">
      {pinnedConversations.length > 0 && (
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 px-1">
            <span className="font-sans text-[10px] font-semibold tracking-[0.8px] text-text-secondary/60 uppercase">
              Pinned · {pinnedConversations.length}
            </span>
          </div>
          <div className="flex flex-col gap-1">{pinnedConversations.map(renderRow)}</div>
        </div>
      )}

      <div>
        {restConversations.length > 0 && (
          <div className="mb-1.5 px-1">
            <span className="font-sans text-[10px] font-semibold tracking-[0.8px] text-text-secondary/60 uppercase">
              {isFilteredView ? "Results" : "All messages"}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-1">{restConversations.map(renderRow)}</div>
      </div>
    </div>
  );
}
