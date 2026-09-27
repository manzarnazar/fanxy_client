"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { candidatesCleared, searchMessageCandidates } from "@/store/slices/messagesSlice";
import { chatService, generateConvId } from "@/features/messages/services/chat.service";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "@/lib/utils/toast";
import type { MessageCandidate } from "@/features/messages/types/messages.types";

const SEARCH_DEBOUNCE_MS = 300;

export function useNewChatModal(onClose: () => void) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const myUid = useAppSelector((state) => state.auth.user?.firebaseId ?? null);
  const { candidates, candidatesStatus } = useAppSelector((state) => state.messages);
  const [query, setQuery] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      dispatch(candidatesCleared());
      return;
    }
    const timer = window.setTimeout(() => {
      void dispatch(searchMessageCandidates(trimmed));
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [dispatch, query]);

  const startChat = async (candidate: MessageCandidate) => {
    if (!myUid) return;
    if (!candidate.firebaseId) {
      // Accounts that never linked Firebase Auth have no chat identity to
      // address messages to — a real backend/mobile constraint, not a bug.
      toast.error(`${candidate.name} isn't available for chat yet.`);
      return;
    }
    setStarting(true);
    try {
      const convId = generateConvId(myUid, candidate.firebaseId);
      await chatService.ensureConversation(convId, myUid, candidate.firebaseId);
      onClose();
      router.push(ROUTES.CHAT(convId));
    } catch {
      toast.error("Unable to start conversation.");
    } finally {
      setStarting(false);
    }
  };

  return { query, setQuery, candidates, candidatesStatus, starting, startChat };
}
