import { formatRelativeTime } from "@/lib/formatter/relativeTime";
import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiNotificationResult } from "@/types/api/notifications.types";
import type { NotificationGroupKey, NotificationItem } from "@/features/notifications/types/notifications.types";

function resolveGroupKey(createdAt: string, now: Date): NotificationGroupKey {
  const created = new Date(createdAt);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  if (created >= startOfToday) return "today";
  if (created >= startOfYesterday) return "yesterday";
  if (created >= startOfWeek) return "week";
  return "month";
}

export function mapApiNotification(notification: ApiNotificationResult, now: Date = new Date()): NotificationItem {
  return {
    id: String(notification.id),
    actorId: String(notification.user_id),
    actorName: notification.full_name,
    actorAvatarUrl: sanitizeMediaUrl(notification.user_image),
    title: notification.title,
    message: notification.message,
    createdAt: notification.created_at,
    timeLabel: formatRelativeTime(notification.created_at, now),
    groupKey: resolveGroupKey(notification.created_at, now),
    postId: notification.post_id !== null ? String(notification.post_id) : null,
    postTitle: notification.post_name,
    postImageUrl: sanitizeMediaUrl(notification.post_image),
  };
}
