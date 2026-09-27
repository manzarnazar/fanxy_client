// Firestore document shapes — these MUST stay byte-compatible with the
// Flutter app (lib/provider/chatprovider.dart), which reads/writes the same
// collections in the same Firebase project (fanxy-9d587). Do not rename
// fields or change value types here.

/** Message doc at chatrooms_fanxy/{convId}/{convId}/{timestampMs}. */
export interface FirestoreChatMessage {
  idFrom: string;
  idTo: string;
  /** Epoch milliseconds AS A STRING — the Flutter app writes and sorts it this way. */
  timestamp: string;
  /** Plain text for type 0, a download URL for media types. */
  content: string;
  read: boolean;
  /** 0 = text, 1 = image, 2 = sticker, 3 = video (TypeMessage in the Flutter app). */
  type: number;
}

/** Conversation doc at chatrooms_fanxy/{convId}. */
export interface FirestoreConversation {
  convid: string;
  /** Exactly two Firebase Auth UIDs. */
  users: string[];
  lastMessage: FirestoreChatMessage | null;
}

/** User directory doc at users_fanxy/{firebaseUid} (created by the Flutter app at signup). */
export interface FirestoreChatUser {
  userid: string;
  /** Backend numeric user id, as a string. */
  profileId?: string;
  name?: string;
  username?: string;
  email?: string;
  profileurl?: string;
  isOnline?: boolean;
  pushToken?: string;
  biodata?: string;
  createdAt?: string;
  chattingWith?: string | null;
  mobileNumber?: string;
}

export const CHAT_MESSAGE_TYPE = {
  text: 0,
  image: 1,
  sticker: 2,
  video: 3,
} as const;
