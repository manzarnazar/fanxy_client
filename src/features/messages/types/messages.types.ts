export type ConversationFilterKey = "all" | "unread" | "pinned" | "read";

/**
 * UI model for one conversation row, derived from the Firestore chatroom doc
 * plus the peer's users_yourappname directory doc. pinned/muted/archived are
 * WEB-LOCAL preferences (localStorage) — the mobile app has no such flags.
 */
export interface Conversation {
  /** Firestore conversation id ("<uidA>-<uidB>", larger uid first). */
  id: string;
  /** Peer's Firebase Auth UID (the chat identity). */
  peerUid: string;
  /** Peer's backend numeric user id (profileId in the directory doc), when known. */
  peerBackendId: string | null;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  online: boolean;
  lastMessageText: string;
  /** Epoch ms of the last message; 0 when the conversation has no messages yet. */
  lastMessageAt: number;
  lastMessageTimeLabel: string;
  unread: boolean;
  /** Read-tick state for the last message when I sent it; null when the peer sent it. */
  outgoingStatus: "sent" | "read" | null;
  pinned: boolean;
  muted: boolean;
  archived: boolean;
}

/** One message in an open chat thread. */
export interface ChatMessage {
  id: string;
  fromMe: boolean;
  /** Plain text for text messages, a media URL for image/video messages. */
  content: string;
  kind: "text" | "image" | "video" | "other";
  timestamp: number;
  timeLabel: string;
  read: boolean;
}

export interface MessageCandidate {
  backendId: string;
  /** Null when this account has never signed in on mobile/Firebase — chat can't start. */
  firebaseId: string | null;
  name: string;
  username: string;
  avatarUrl: string | null;
  verified: boolean;
  isCreator: boolean;
}

/** Web-local per-conversation preferences, persisted in localStorage. */
export interface ConversationPrefs {
  pinned?: boolean;
  muted?: boolean;
  archived?: boolean;
}
