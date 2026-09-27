import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  FirestoreChatMessage,
  FirestoreChatUser,
  FirestoreConversation,
} from "@/features/messages/types/chat.types";
import { CHAT_MESSAGE_TYPE } from "@/features/messages/types/chat.types";

// Collection names and document shapes are confirmed against the Flutter
// app's lib/utils/firestoreconstants.dart + lib/provider/chatprovider.dart —
// web and mobile share these exact Firestore paths in project fanxy-9d587.
const USERS_COL = "users_fanxy";
const CHATROOMS_COL = "chatrooms_fanxy";

/**
 * Same algorithm as the Flutter app (chatpage.dart): lexicographically
 * LARGER uid first, joined with "-". Both clients must compute identical ids.
 */
export function generateConvId(uidA: string, uidB: string): string {
  return uidA > uidB ? `${uidA}-${uidB}` : `${uidB}-${uidA}`;
}

export const chatService = {
  /**
   * Create-if-not-exists into the shared user directory. Mobile creates this
   * doc at signup; web users who only ever signed in here still need one so
   * mobile peers can resolve their name/avatar.
   */
  async registerChatUser(user: FirestoreChatUser): Promise<void> {
    const ref = doc(db, USERS_COL, user.userid);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) await setDoc(ref, user);
  },

  /** Batch-load peer directory docs (whereIn documentId, chunked by Firestore's 10-id cap). */
  async fetchChatUsers(uids: string[]): Promise<Map<string, FirestoreChatUser>> {
    const result = new Map<string, FirestoreChatUser>();
    for (let index = 0; index < uids.length; index += 10) {
      const chunk = uids.slice(index, index + 10);
      const snapshot = await getDocs(query(collection(db, USERS_COL), where(documentId(), "in", chunk)));
      snapshot.docs.forEach((docSnapshot) => {
        result.set(docSnapshot.id, docSnapshot.data() as FirestoreChatUser);
      });
    }
    return result;
  },

  subscribeConversations(
    myUid: string,
    callback: (docs: FirestoreConversation[]) => void,
    onError?: (error: Error) => void,
  ): () => void {
    const q = query(collection(db, CHATROOMS_COL), where("users", "array-contains", myUid));
    return onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.docs.map((docSnapshot) => docSnapshot.data() as FirestoreConversation));
      },
      onError,
    );
  },

  subscribeMessages(
    convId: string,
    messageLimit: number,
    callback: (docs: FirestoreChatMessage[]) => void,
    onError?: (error: Error) => void,
  ): () => void {
    // The messages subcollection is named after the conversation id itself —
    // a Flutter-side quirk the web must reproduce exactly.
    const q = query(collection(db, CHATROOMS_COL, convId, convId), orderBy("timestamp", "desc"), limit(messageLimit));
    return onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.docs.map((docSnapshot) => docSnapshot.data() as FirestoreChatMessage).reverse());
      },
      onError,
    );
  },

  /** Create-if-not-exists — never overwrite an existing conversation. */
  async ensureConversation(convId: string, myUid: string, peerUid: string): Promise<void> {
    const ref = doc(db, CHATROOMS_COL, convId);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) return;
    const emptyLastMessage: FirestoreChatMessage = {
      content: "",
      idFrom: myUid,
      idTo: peerUid,
      read: false,
      timestamp: String(Date.now()),
      type: CHAT_MESSAGE_TYPE.text,
    };
    const data: FirestoreConversation = { convid: convId, users: [myUid, peerUid], lastMessage: emptyLastMessage };
    await setDoc(ref, data);
  },

  async sendTextMessage(convId: string, myUid: string, peerUid: string, content: string): Promise<void> {
    const timestamp = String(Date.now());
    const message: FirestoreChatMessage = {
      idFrom: myUid,
      idTo: peerUid,
      timestamp,
      content: content.trim(),
      read: false,
      type: CHAT_MESSAGE_TYPE.text,
    };
    await setDoc(doc(db, CHATROOMS_COL, convId, convId, timestamp), message);
    await updateDoc(doc(db, CHATROOMS_COL, convId), { lastMessage: message });
  },

  /**
   * Mark every unread incoming message read. Unlike the Flutter app this does
   * NOT blank lastMessage.content — mobile derives "unread" purely from
   * lastMessage.read, so keeping the preview text stays fully compatible.
   */
  async markConversationRead(convId: string, myUid: string): Promise<void> {
    const q = query(
      collection(db, CHATROOMS_COL, convId, convId),
      where("idTo", "==", myUid),
      where("read", "==", false),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;
    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnapshot) => batch.update(docSnapshot.ref, { read: true }));
    batch.update(doc(db, CHATROOMS_COL, convId), { "lastMessage.read": true });
    await batch.commit();
  },
};
