import { doc, updateDoc } from "firebase/firestore";
import { getMessaging, getToken, isSupported, onMessage, type Messaging } from "firebase/messaging";
import { app, db } from "@/lib/firebase";

// Same Firestore field/collection the Flutter app uses for web pushes
// (lib/utils/firestoreconstants.dart pushToken + users_yourappname).
const USERS_COL = "users_yourappname";

function buildServiceWorkerUrl(): string {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };
  return `/firebase-messaging-sw.js?${new URLSearchParams(config).toString()}`;
}

export interface ForegroundChatMessage {
  title: string;
  body: string;
}

export const pushTokenService = {
  /**
   * Request permission, mint the web FCM token (same vapid-key flow as the
   * Flutter web build's getFirebaseWebToken) and store it on the user's
   * Firestore directory doc so peers can address pushes to this session.
   * Returns the token, or null when unsupported/denied/unconfigured.
   */
  async register(firebaseUid: string, vapidKey: string): Promise<string | null> {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("Notification" in window)) return null;
    if (!(await isSupported().catch(() => false))) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const registration = await navigator.serviceWorker.register(buildServiceWorkerUrl());
    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
    if (!token) return null;

    await updateDoc(doc(db, USERS_COL, firebaseUid), { pushToken: token }).catch(() => {
      // Directory doc may not exist yet on a brand-new account; the chat
      // bootstrap creates it and the next register() call stores the token.
    });
    return token;
  },

  /** Foreground messages don't hit the service worker — surface them in-app. */
  subscribeForeground(onChatMessage: (message: ForegroundChatMessage) => void): () => void {
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;
    void isSupported()
      .catch(() => false)
      .then((supported) => {
        if (!supported || cancelled) return;
        const messaging: Messaging = getMessaging(app);
        unsubscribe = onMessage(messaging, (payload) => {
          if (payload.data?.type !== "chat") return;
          onChatMessage({
            title: payload.notification?.title ?? "New message",
            body: payload.notification?.body ?? "",
          });
        });
      });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  },
};
