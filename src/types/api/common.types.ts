/**
 * Shared response envelope used by every real backend list endpoint
 * (get_post, get_story, list_of_live_users, get_notification, ...).
 * Confirmed against the Flutter app's Dart models — this shape is real,
 * not a guess.
 */
export interface ApiListEnvelope<TResult> {
  status: number;
  message: string;
  result: TResult[];
  total_rows: number;
  total_page: number;
  current_page: number;
  more_page: boolean;
}

/**
 * Response envelope used by real backend endpoints that return a plain
 * result array with no pagination (get_profile, get_pages,
 * get_social_links, general_setting, ...).
 */
export interface ApiSimpleEnvelope<TResult> {
  status: number;
  message: string;
  result: TResult[];
}

/** Response envelope for real mutation endpoints (update_profile, become_creator, ...). */
export interface ApiSuccessEnvelope {
  status: number;
  message: string;
}
