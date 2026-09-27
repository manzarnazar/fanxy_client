import type { AnalyticsRangeKey } from "@/features/creator-analytics/types/creator-analytics.types";

export const ANALYTICS_RANGES: Array<{ key: AnalyticsRangeKey; label: string }> = [
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "year", label: "This Year" },
  { key: "all", label: "Lifetime" },
];

export const DEFAULT_ANALYTICS_RANGE: AnalyticsRangeKey = "30d";

/**
 * get_earning_list / get_user_post only paginate — there is no server-side
 * date filter — so the bundle loads up to these many pages and derives all
 * range filtering client-side. Caps keep a very large account from
 * downloading its entire history on one page view.
 */
export const MAX_EARNING_PAGES = 10;
export const MAX_POST_PAGES = 5;

const DONUT_COLOR_CLASSES = [
  "text-primary-light",
  "text-secondary-light",
  "text-warning",
  "text-success",
  "text-primary",
  "text-danger",
];

/** Color class per revenue slice — slices are sorted by revenue, so index keeps adjacent colors distinct. */
export function donutColorClassName(index: number): string {
  return DONUT_COLOR_CLASSES[index % DONUT_COLOR_CLASSES.length];
}
