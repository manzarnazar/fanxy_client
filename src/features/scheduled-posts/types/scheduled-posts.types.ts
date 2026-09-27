export type ScheduledViewMode = "calendar" | "list";
export type ScheduledTypeFilter = "all" | "posts" | "reels";
export type ScheduledRangeFilter = "all" | "today" | "tomorrow" | "week" | "month";

/**
 * One upcoming scheduled post, derived from get_user_post rows with
 * is_schedule = 1 and a future schedule_date/schedule_time. The backend
 * auto-publishes at that datetime — there is no publish-now or reschedule
 * endpoint, so the only management action is delete.
 */
export interface ScheduledPost {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  isVideo: boolean;
  mediaCount: number;
  /** Epoch ms of the scheduled publish datetime (local time). */
  scheduledAtMs: number;
  dateLabel: string;
  timeLabel: string;
  createdAt: string;
}
