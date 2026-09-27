"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { threadFailed, threadMessagesReceived, threadOpened, threadClosed } from "@/store/slices/messagesSlice";
import { chatService } from "@/features/messages/services/chat.service";
import { sendChatPushNotification } from "@/features/messages/services/chat-push.service";
import { mapChatMessage } from "@/features/messages/mapper/messages.mapper";
import { toast } from "@/lib/utils/toast";

const THREAD_MESSAGE_LIMIT = 50;

/**
 * Realtime message stream + composer actions for one open conversation.
 * Marks incoming messages read on open and again whenever new ones arrive
 * while the thread is on screen (mirrors the Flutter chatpage behavior).
 */
export function useChatThread(convId: string) {
  const dispatch = useAppDispatch();
  const myUid = useAppSelector((state) => state.auth.user?.firebaseId ?? null);
  const myName = useAppSelector((state) => state.auth.user?.fullName ?? "");
  const { threadMessages, threadStatus, conversations } = useAppSelector((state) => state.messages);
  const [sending, setSending] = useState(false);

  const conversation = useMemo(
    () => conversations.find((item) => item.id === convId) ?? null,
    [conversations, convId],
  );

  useEffect(() => {
    if (!myUid) return;
    dispatch(threadOpened(convId));

    const unsubscribe = chatService.subscribeMessages(
      convId,
      THREAD_MESSAGE_LIMIT,
      (docs) => {
        const now = new Date();
        dispatch(
          threadMessagesReceived({
            convId,
            messages: docs.filter((doc) => doc.content).map((doc) => mapChatMessage(doc, myUid, now)),
          }),
        );
        if (docs.some((doc) => doc.idTo === myUid && !doc.read)) {
          void chatService.markConversationRead(convId, myUid).catch(() => {});
        }
      },
      () => dispatch(threadFailed({ convId })),
    );

    return () => {
      unsubscribe();
      dispatch(threadClosed());
    };
  }, [dispatch, convId, myUid]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || !myUid || !conversation) return false;
      setSending(true);
      try {
        await chatService.sendTextMessage(convId, myUid, conversation.peerUid, content);
        // Best-effort push to the recipient (mirrors the Flutter app).
        void sendChatPushNotification({
          myFirebaseId: myUid,
          myName,
          peerFirebaseId: conversation.peerUid,
          messageContent: content,
        });
        return true;
      } catch {
        toast.error("Unable to send message.");
        return false;
      } finally {
        setSending(false);
      }
    },
    [convId, myUid, myName, conversation],
  );

  return {
    conversation,
    messages: threadMessages,
    status: threadStatus,
    sending,
    send,
    chatReady: Boolean(myUid),
  };
}
