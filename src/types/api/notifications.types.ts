import type { ApiListEnvelope } from "@/types/api/common.types";

// Real response shape for get_notification, confirmed against the Flutter
// app's lib/model/mynotificationmodel.dart. There is no read/unread flag,
// no notification "type" enum with documented codes, and no bulk/pin/
// archive/settings/summary endpoints — this is intentionally minimal.
export interface ApiNotificationResult {
  id: number;
  type: number | null;
  user_id: number;
  to_user_id: number;
  post_id: number | null;
  title: string | null;
  message: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  user_image: string | null;
  post_name: string | null;
  post_image: string | null;
}

export type ApiNotificationsResponse = ApiListEnvelope<ApiNotificationResult>;
