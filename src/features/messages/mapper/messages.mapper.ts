import { formatRelativeTime } from "@/lib/formatter/relativeTime";
import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import { CHAT_MESSAGE_TYPE } from "@/features/messages/types/chat.types";
import type {
  FirestoreChatMessage,
  FirestoreChatUser,
  FirestoreConversation,
} from "@/features/messages/types/chat.types";
import type { ApiSearchUserResult } from "@/types/api/search.types";
import type {
  ChatMessage,
  Conversation,
  ConversationPrefs,
  MessageCandidate,
} from "@/features/messages/types/messages.types";

function messageKind(type: number): ChatMessage["kind"] {
  if (type === CHAT_MESSAGE_TYPE.text) return "text";
  if (type === CHAT_MESSAGE_TYPE.image) return "image";
  if (type === CHAT_MESSAGE_TYPE.video) return "video";
  return "other";
}

function previewText(message: FirestoreChatMessage): string {
  if (message.type === CHAT_MESSAGE_TYPE.image) return "📷 Photo";
  if (message.type === CHAT_MESSAGE_TYPE.video) return "🎬 Video";
  if (message.type === CHAT_MESSAGE_TYPE.sticker) return "Sticker";
  return message.content;
}

export function mapConversation(
  doc: FirestoreConversation,
  myUid: string,
  peerDoc: FirestoreChatUser | undefined,
  prefs: ConversationPrefs,
  now: Date = new Date(),
): Conversation | null {
  const peerUid = doc.users.find((uid) => uid !== myUid);
  if (!peerUid) return null;

  const last = doc.lastMessage;
  const lastAt = last ? Number(last.timestamp) || 0 : 0;
  const fromMe = last?.idFrom === myUid;
  // ensureConversation seeds an empty-content lastMessage (matching the
  // Flutter app) — treat that as "no messages yet", not as an unread message.
  const hasRealMessage = Boolean(last && last.content);

  return {
    id: doc.convid,
    peerUid,
    peerBackendId: peerDoc?.profileId ?? null,
    name: peerDoc?.name || peerDoc?.username || "Member",
    username: peerDoc?.username ?? null,
    avatarUrl: sanitizeMediaUrl(peerDoc?.profileurl),
    online: peerDoc?.isOnline === true,
    lastMessageText: last && hasRealMessage ? previewText(last) : "Say hello 👋",
    lastMessageAt: lastAt,
    lastMessageTimeLabel: lastAt > 0 ? formatRelativeTime(new Date(lastAt).toISOString(), now) : "",
    unread: Boolean(last && hasRealMessage && !last.read && !fromMe),
    outgoingStatus: last && hasRealMessage && fromMe ? (last.read ? "read" : "sent") : null,
    pinned: prefs.pinned ?? false,
    muted: prefs.muted ?? false,
    archived: prefs.archived ?? false,
  };
}

export function mapChatMessage(message: FirestoreChatMessage, myUid: string, now: Date = new Date()): ChatMessage {
  const timestamp = Number(message.timestamp) || 0;
  return {
    id: message.timestamp,
    fromMe: message.idFrom === myUid,
    content: message.content,
    kind: messageKind(message.type),
    timestamp,
    timeLabel: timestamp > 0 ? formatRelativeTime(new Date(timestamp).toISOString(), now) : "",
    read: message.read,
  };
}

export function mapSearchUserToCandidate(row: ApiSearchUserResult): MessageCandidate {
  return {
    backendId: String(row.id),
    firebaseId: row.firebase_id,
    name: row.full_name || row.user_name,
    username: row.user_name,
    avatarUrl: sanitizeMediaUrl(row.image),
    verified: row.is_verified_at === 1,
    isCreator: row.is_creator === 1,
  };
}
