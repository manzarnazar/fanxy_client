import type { ConversationFilterKey } from "@/features/messages/types/messages.types";

export interface ConversationFilterDef {
  key: ConversationFilterKey;
  label: string;
}

// Only filters the real Firestore chat model can answer — no
// following/subscribed/creator segmentation exists in the chat data.
export const CONVERSATION_FILTERS: ConversationFilterDef[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "pinned", label: "Pinned" },
  { key: "read", label: "Read" },
];
