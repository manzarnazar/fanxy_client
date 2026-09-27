"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  chatIdentityMissing,
  conversationsFailed,
  conversationsLoading,
  conversationsReceived,
} from "@/store/slices/messagesSlice";
import { chatService } from "@/features/messages/services/chat.service";
import { mapConversation } from "@/features/messages/mapper/messages.mapper";
import { loadChatPrefs } from "@/features/messages/utils/chat-prefs";
import type { FirestoreChatUser, FirestoreConversation } from "@/features/messages/types/chat.types";

/**
 * Global realtime conversations listener — mounted once in the (main) layout
 * so the header unread badge stays live on every page, not just /messages.
 * Raw Firestore docs stay in refs; only mapped, serializable Conversation[]
 * ever reaches Redux.
 */
export function useConversationsSubscription() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const myUid = user?.firebaseId ?? null;

  const docsRef = useRef<FirestoreConversation[]>([]);
  const peersRef = useRef<Map<string, FirestoreChatUser>>(new Map());

  const publish = useCallback(() => {
    if (!myUid) return;
    const prefs = loadChatPrefs();
    const now = new Date();
    const conversations = docsRef.current
      .map((doc) => {
        const peerUid = doc.users.find((uid) => uid !== myUid);
        return mapConversation(doc, myUid, peerUid ? peersRef.current.get(peerUid) : undefined, prefs[doc.convid] ?? {}, now);
      })
      .filter((conversation): conversation is NonNullable<typeof conversation> => conversation !== null)
      .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    dispatch(conversationsReceived(conversations));
  }, [dispatch, myUid]);

  useEffect(() => {
    if (!user) return;
    if (!myUid) {
      // Backend account with no firebase_id (never linked to Firebase Auth) —
      // chat has no identity to key off, so surface that instead of erroring.
      dispatch(chatIdentityMissing(true));
      return;
    }
    dispatch(chatIdentityMissing(false));
    dispatch(conversationsLoading());

    // Make sure our own directory doc exists so peers (including the mobile
    // app) can resolve our name/avatar. Same shape the Flutter app writes.
    void chatService
      .registerChatUser({
        userid: myUid,
        profileId: user.id,
        name: user.fullName,
        username: user.username,
        email: user.email,
        profileurl: user.avatarUrl ?? "",
        isOnline: true,
        pushToken: "",
        biodata: user.bio ?? "",
        createdAt: String(Date.now()),
        chattingWith: null,
        mobileNumber: user.phone ?? "",
      })
      .catch(() => {
        // Non-fatal: the doc usually already exists (created by mobile signup).
      });

    const unsubscribe = chatService.subscribeConversations(
      myUid,
      (docs) => {
        docsRef.current = docs;
        const peerUids = Array.from(
          new Set(docs.flatMap((doc) => doc.users).filter((uid) => uid !== myUid)),
        );
        const missing = peerUids.filter((uid) => !peersRef.current.has(uid));

        if (missing.length === 0) {
          publish();
          return;
        }
        void chatService
          .fetchChatUsers(missing)
          .then((fetched) => {
            fetched.forEach((value, key) => peersRef.current.set(key, value));
          })
          .finally(publish);
      },
      () => {
        dispatch(conversationsFailed("Unable to load your conversations."));
      },
    );
    return unsubscribe;
  }, [dispatch, user, myUid, publish]);

  /** Re-map with fresh localStorage prefs (after a pin/mute/archive toggle). */
  return { republish: publish };
}
