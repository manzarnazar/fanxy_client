import apiClient from "@/services/api.client";
import type { ApiNotificationsResponse } from "@/types/api/notifications.types";

// Endpoint names, HTTP method, and payload fields below are confirmed
// against the real Flutter app's lib/webservice/apiservices.dart
// (get_notification, read_notification) — not guesses. There is no real
// bulk-action, pin/archive/delete, settings, or summary/sidebar endpoint.
export const notificationsService = {
  getNotifications: (page: number) => apiClient.post<ApiNotificationsResponse>("get_notification", { page }),

  markRead: (notificationId: string) =>
    apiClient.post<{ status: number; message: string }>("read_notification", { notification_id: notificationId }),
};
