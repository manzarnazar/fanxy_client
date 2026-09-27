import { chatService } from "@/features/messages/services/chat.service";

/**
 * Fire-and-forget chat push, mirroring the Flutter app's sendFCMPushNoti
 * (chatpage.dart:483): after a message is written to Firestore, notify the
 * recipient via FCM. The actual FCM v1 call happens in our server route so
 * the Firebase service-account key never reaches the browser.
 *
 * Delivery caveat (inherited from the mobile app): mobile clients store a
 * OneSignal id in the Firestore pushToken field, which FCM rejects — only
 * recipients with a real FCM token (web sessions) receive the push.
 */
export async function sendChatPushNotification(input: {
  myFirebaseId: string;
  myName: string;
  peerFirebaseId: string;
  messageContent: string;
}): Promise<void> {
  try {
    const peers = await chatService.fetchChatUsers([input.peerFirebaseId]);
    const pushToken = peers.get(input.peerFirebaseId)?.pushToken;
    if (!pushToken) return;

    await fetch("/api/notifications/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: pushToken,
        title: `New Message from ${input.myName}:`,
        body: input.messageContent,
        fromFId: input.myFirebaseId,
        toFId: input.peerFirebaseId,
        username: input.myName,
      }),
    });
  } catch {
    // Notifications are best-effort — a failed push never blocks the message.
  }
}
