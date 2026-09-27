import type {
  ScheduledRangeFilter,
  ScheduledTypeFilter,
  ScheduledViewMode,
} from "@/features/scheduled-posts/types/scheduled-posts.types";

export const SCHEDULED_VIEW_MODES: Array<{ key: ScheduledViewMode; label: string }> = [
  { key: "calendar", label: "Calendar" },
  { key: "list", label: "List" },
];

export const SCHEDULED_TYPE_FILTERS: Array<{ key: ScheduledTypeFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "posts", label: "Posts" },
  { key: "reels", label: "Reels" },
];

export const SCHEDULED_RANGE_FILTERS: Array<{ key: ScheduledRangeFilter; label: string }> = [
  { key: "all", label: "Upcoming" },
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
];

/** get_user_post has no schedule filter — pages are fetched and filtered client-side, capped here. */
export const MAX_SCHEDULED_PAGES = 5;
