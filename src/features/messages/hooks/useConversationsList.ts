"use client";

import { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { conversationPrefUpdated, selectConversation } from "@/store/slices/messagesSlice";
import { chatService } from "@/features/messages/services/chat.service";
import { messagesService } from "@/features/messages/services/messages.service";
import { saveChatPref } from "@/features/messages/utils/chat-prefs";
import { toast } from "@/lib/utils/toast";
import type { Conversation, ConversationFilterKey } from "@/features/messages/types/messages.types";

export function useConversationsList() {
  const dispatch = useAppDispatch();
  const myUid = useAppSelector((state) => state.auth.user?.firebaseId ?? null);
  const { conversations, conversationsStatus, conversationsError, chatIdentityMissing, selectedId } = useAppSelector(
    (state) => state.messages,
  );

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ConversationFilterKey>("all");
  const [showArchived, setShowArchived] = useState(false);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return conversations.filter((conversation) => {
      if (conversation.archived) return false;
      if (filter === "unread" && !conversation.unread) return false;
      if (filter === "read" && conversation.unread) return false;
      if (filter === "pinned" && !conversation.pinned) return false;
      if (
        trimmed &&
        !conversation.name.toLowerCase().includes(trimmed) &&
        !(conversation.username ?? "").toLowerCase().includes(trimmed) &&
        !conversation.lastMessageText.toLowerCase().includes(trimmed)
      ) {
        return false;
      }
      return true;
    });
  }, [conversations, query, filter]);

  const pinned = useMemo(() => filtered.filter((conversation) => conversation.pinned), [filtered]);
  const rest = useMemo(() => filtered.filter((conversation) => !conversation.pinned), [filtered]);
  const archived = useMemo(() => conversations.filter((conversation) => conversation.archived), [conversations]);

  const totalUnread = useMemo(
    () => conversations.filter((conversation) => conversation.unread && !conversation.muted).length,
    [conversations],
  );
  const onlineFriends = useMemo(() => conversations.filter((conversation) => conversation.online), [conversations]);

  const select = useCallback(
    (conversationId: string | null) => {
      dispatch(selectConversation(conversationId));
    },
    [dispatch],
  );

  const setPref = useCallback(
    (convId: string, patch: Partial<Pick<Conversation, "pinned" | "muted" | "archived">>, message?: string) => {
      saveChatPref(convId, patch);
      dispatch(conversationPrefUpdated({ convId, prefs: patch }));
      if (message) toast.success(message);
    },
    [dispatch],
  );

  const togglePin = useCallback(
    (conversation: Conversation) =>
      setPref(
        conversation.id,
        { pinned: !conversation.pinned },
        conversation.pinned ? "Conversation unpinned." : "Conversation pinned.",
      ),
    [setPref],
  );
  const toggleMute = useCallback(
    (conversation: Conversation) =>
      setPref(
        conversation.id,
        { muted: !conversation.muted },
        conversation.muted ? "Notifications unmuted." : "Conversation muted.",
      ),
    [setPref],
  );
  const toggleArchive = useCallback(
    (conversation: Conversation) =>
      setPref(
        conversation.id,
        { archived: !conversation.archived },
        conversation.archived ? "Conversation unarchived." : "Conversation archived.",
      ),
    [setPref],
  );

  const markRead = useCallback(
    async (conversation: Conversation) => {
      if (!myUid) return;
      try {
        await chatService.markConversationRead(conversation.id, myUid);
      } catch {
        toast.error("Unable to mark conversation read.");
      }
    },
    [myUid],
  );

  const markAllRead = useCallback(async () => {
    if (!myUid) return;
    const unreadConversations = conversations.filter((conversation) => conversation.unread);
    if (unreadConversations.length === 0) return;
    try {
      await Promise.all(
        unreadConversations.map((conversation) => chatService.markConversationRead(conversation.id, myUid)),
      );
      toast.success("All conversations marked read.");
    } catch {
      toast.error("Unable to mark all conversations read.");
    }
  }, [conversations, myUid]);

  const blockUser = useCallback(async (conversation: Conversation) => {
    if (!conversation.peerBackendId) {
      toast.error("Unable to block this user.");
      return;
    }
    try {
      await messagesService.toggleBlock(conversation.peerBackendId);
      toast.success(`${conversation.name} blocked.`);
    } catch {
      // API interceptor already surfaced the error toast.
    }
  }, []);

  return {
    chatIdentityMissing,
    status: conversationsStatus,
    error: conversationsError,
    pinned,
    rest,
    archived,
    resultCount: filtered.length,
    totalUnread,
    onlineFriends,
    query,
    setQuery,
    filter,
    setFilter,
    showArchived,
    setShowArchived,
    selectedId,
    select,
    togglePin,
    toggleMute,
    toggleArchive,
    markRead,
    markAllRead,
    blockUser,
  };
}
