"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircleOff, SquarePen } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useConversationsList } from "@/features/messages/hooks/useConversationsList";
import { useNewChatModal } from "@/features/messages/hooks/useNewChatModal";
import { MessagesHeaderBar } from "@/features/messages/components/MessagesHeaderBar";
import { MessagesSearchBar } from "@/features/messages/components/MessagesSearchBar";
import { MessagesFilterChips } from "@/features/messages/components/MessagesFilterChips";
import { MessagesOnlineNowStrip } from "@/features/messages/components/MessagesOnlineNowStrip";
import { MessagesConversationList } from "@/features/messages/components/MessagesConversationList";
import { MessagesArchivedSection } from "@/features/messages/components/MessagesArchivedSection";
import { MessagesNewChatModal } from "@/features/messages/components/MessagesNewChatModal";
import { MessagesPreviewPanel } from "@/features/messages/components/MessagesPreviewPanel";
import { MessagesPreviewEmptyState } from "@/features/messages/components/MessagesPreviewEmptyState";
import type { Conversation } from "@/features/messages/types/messages.types";

export function MessagesPageContent() {
  const router = useRouter();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const [newChatOpen, setNewChatOpen] = useState(false);

  const list = useConversationsList();
  const newChat = useNewChatModal(() => setNewChatOpen(false));

  if (isBootstrapped && !user) {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[680px]">
          <SectionStateMessage
            variant="empty"
            title="Sign in to see your messages"
            body="Your conversations live in your account — sign in to pick them up."
            emptyHref={ROUTES.SIGN_IN}
            emptyLabel="Sign In"
          />
        </div>
      </main>
    );
  }

  if (list.chatIdentityMissing) {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[680px]">
          <SectionStateMessage
            variant="empty"
            icon={MessageCircleOff}
            title="Chat isn't available for this account"
            body="This account isn't linked to the chat service yet. Sign in once with Google or your phone number to activate messaging."
          />
        </div>
      </main>
    );
  }

  const allVisible = [...list.pinned, ...list.rest];
  const isFiltered = list.filter !== "all" || list.query.trim().length > 0;
  const isEmptyInbox = list.status === "succeeded" && allVisible.length === 0 && !isFiltered;
  const noResults = list.status === "succeeded" && allVisible.length === 0 && isFiltered;

  const selectedConversation =
    allVisible.find((conversation) => conversation.id === list.selectedId) ??
    list.archived.find((conversation) => conversation.id === list.selectedId) ??
    null;

  // Desktop keeps the design's list + preview split; on smaller screens the
  // preview pane is hidden, so a row tap goes straight into the chat.
  const openConversation = (conversation: Conversation) => {
    list.select(conversation.id);
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      router.push(ROUTES.CHAT(conversation.id));
    }
  };

  return (
    <main className="flex min-w-0 flex-1 overflow-hidden">
      {/* Conversation column */}
      <div className="relative flex w-full min-w-0 flex-col border-primary/10 lg:w-[412px] lg:shrink-0 lg:border-r">
        <div className="flex-1 overflow-y-auto px-5 pt-5.5 pb-[110px]">
          <MessagesHeaderBar
            totalUnread={list.totalUnread}
            onlineCount={list.onlineFriends.length}
            showArchived={list.showArchived}
            onOpenNewChat={() => setNewChatOpen(true)}
            onToggleArchived={() => list.setShowArchived(!list.showArchived)}
            onMarkAllRead={() => void list.markAllRead()}
          />

          <MessagesSearchBar query={list.query} onQueryChange={list.setQuery} />
          <MessagesFilterChips
            conversations={[...list.pinned, ...list.rest, ...list.archived]}
            activeFilter={list.filter}
            onSelect={list.setFilter}
          />

          <div className="mt-3.5">
            <MessagesOnlineNowStrip onlineFriends={list.onlineFriends} onSelect={openConversation} />
          </div>

          <div className="mt-3.5">
            <MessagesConversationList
              status={list.status}
              error={list.error}
              pinnedConversations={list.pinned}
              restConversations={list.rest}
              noResults={noResults}
              isEmptyInbox={isEmptyInbox}
              isFilteredView={isFiltered}
              selectedId={list.selectedId}
              onSelect={openConversation}
              onMarkRead={list.markRead}
              onTogglePin={list.togglePin}
              onToggleMute={list.toggleMute}
              onToggleArchive={list.toggleArchive}
              onBlock={list.blockUser}
              onClearFilters={() => {
                list.setFilter("all");
                list.setQuery("");
              }}
              onStartNewChat={() => setNewChatOpen(true)}
            />
          </div>

          {list.showArchived && (
            <MessagesArchivedSection
              archived={list.archived}
              archivedOpen={list.showArchived}
              onToggle={() => list.setShowArchived(!list.showArchived)}
              selectedId={list.selectedId}
              onSelect={openConversation}
              onMarkRead={list.markRead}
              onTogglePin={list.togglePin}
              onToggleMute={list.toggleMute}
              onToggleArchive={list.toggleArchive}
              onBlock={list.blockUser}
            />
          )}
        </div>

        {/* New Chat FAB — pink gradient, pinned to the list column */}
        <button
          type="button"
          onClick={() => setNewChatOpen(true)}
          className="absolute right-5 bottom-[86px] z-10 flex h-[50px] items-center gap-2 rounded-2xl bg-gradient-to-br from-secondary-light to-secondary-dark px-4.5 font-sans text-[13px] font-semibold text-white shadow-[0_16px_32px_-14px_rgba(226,29,91,.8)] transition hover:-translate-y-0.5 lg:bottom-5"
        >
          <SquarePen className="h-[17px] w-[17px]" aria-hidden="true" />
          New Chat
        </button>
      </div>

      {/* Preview panel — desktop only */}
      <div className="hidden min-w-0 flex-1 overflow-y-auto lg:block">
        {selectedConversation ? (
          <MessagesPreviewPanel conversation={selectedConversation} onBlock={list.blockUser} />
        ) : (
          <MessagesPreviewEmptyState onStartNewChat={() => setNewChatOpen(true)} />
        )}
      </div>

      <MessagesNewChatModal
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        query={newChat.query}
        onQueryChange={newChat.setQuery}
        candidates={newChat.candidates}
        candidatesStatus={newChat.candidatesStatus}
        starting={newChat.starting}
        onSelectCandidate={(candidate) => void newChat.startChat(candidate)}
      />
    </main>
  );
}
