import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiPostResult } from "@/types/api/post.types";
import type { ScheduledPost } from "@/features/scheduled-posts/types/scheduled-posts.types";

/**
 * Same parsing the Flutter app uses ("schedule_date schedule_time:00",
 * local time): posts whose schedule datetime has already passed render as
 * normal published posts, so they are excluded here.
 */
export function parseScheduleDateTime(scheduleDate: string | null, scheduleTime: string | null): number | null {
  if (!scheduleDate) return null;
  const parsed = new Date(`${scheduleDate}T${scheduleTime || "00:00"}:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
}

export function mapApiScheduledPost(post: ApiPostResult, now: Date = new Date()): ScheduledPost | null {
  if (post.is_schedule !== 1) return null;
  const scheduledAtMs = parseScheduleDateTime(post.schedule_date, post.schedule_time);
  if (scheduledAtMs === null || scheduledAtMs <= now.getTime()) return null;

  const scheduledAt = new Date(scheduledAtMs);
  const primaryContent = post.post_content[0] ?? null;

  return {
    id: String(post.id),
    title: post.title || post.description || "Untitled post",
    description: post.description,
    thumbnailUrl: sanitizeMediaUrl(primaryContent?.image),
    isVideo: primaryContent?.content_type === 2,
    mediaCount: post.post_content.length,
    scheduledAtMs,
    dateLabel: scheduledAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    timeLabel: scheduledAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
    createdAt: post.created_at,
  };
}
