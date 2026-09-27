"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectVapidKey } from "@/store/slices/appSettingsSlice";
import { pushTokenService } from "@/services/push-token.service";
import { toast } from "@/lib/utils/toast";

/**
 * Registers this browser for chat pushes (FCM token → the user's Firestore
 * directory doc, mirroring the Flutter web build) and surfaces foreground
 * chat pushes as toasts. Renders nothing.
 */
export function PushNotificationsBridge() {
  const firebaseUid = useAppSelector((state) => state.auth.user?.firebaseId ?? null);
  const vapidKey = useAppSelector(selectVapidKey);
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!firebaseUid || !vapidKey || registeredRef.current) return;
    registeredRef.current = true;
    void pushTokenService.register(firebaseUid, vapidKey).catch(() => {
      // Push registration is best-effort; chat itself works without it.
    });
  }, [firebaseUid, vapidKey]);

  useEffect(() => {
    if (!firebaseUid) return;
    return pushTokenService.subscribeForeground((message) => {
      toast.info(`${message.title} ${message.body}`.trim());
    });
  }, [firebaseUid]);

  return null;
}
