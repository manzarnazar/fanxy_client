"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { chatService } from "@/features/messages/services/chat.service";
import { mapChatMessage } from "@/features/messages/mapper/messages.mapper";
import type { ChatMessage } from "@/features/messages/types/messages.types";

const PREVIEW_MESSAGE_LIMIT = 50;

interface PreviewSnapshot {
  convId: string | null;
  messages: ChatMessage[];
}

/**
 * Live preview data for the selected conversation: the last few message
 * bubbles plus every image/video message for the shared-media grid — all
 * from the same real Firestore message stream the chat page uses.
 */
export function useConversationPreview(convId: string | null) {
  const myUid = useAppSelector((state) => state.auth.user?.firebaseId ?? null);
  // Messages stay tagged with the conversation they belong to — a stale
  // snapshot from the previously selected conversation is simply ignored.
  const [snapshot, setSnapshot] = useState<PreviewSnapshot>({ convId: null, messages: [] });

  useEffect(() => {
    if (!convId || !myUid) return;
    const unsubscribe = chatService.subscribeMessages(
      convId,
      PREVIEW_MESSAGE_LIMIT,
      (docs) => {
        const now = new Date();
        setSnapshot({
          convId,
          messages: docs.filter((doc) => doc.content).map((doc) => mapChatMessage(doc, myUid, now)),
        });
      },
      () => setSnapshot({ convId, messages: [] }),
    );
    return unsubscribe;
  }, [convId, myUid]);

  const messages = snapshot.convId === convId ? snapshot.messages : [];
  const loading = Boolean(convId && myUid) && snapshot.convId !== convId;

  return {
    loading,
    recentMessages: messages.slice(-3),
    mediaItems: messages.filter((message) => message.kind === "image" || message.kind === "video"),
  };
}
