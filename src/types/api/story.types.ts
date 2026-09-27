import type { ApiListEnvelope } from "@/types/api/common.types";

// Real response shape for get_story / get_user_story, confirmed against the
// Flutter app's lib/model/storymodel.dart. Stories are grouped by creator;
// there is no per-username fetch — the client finds the matching group
// client-side from the full list.
export interface ApiStoryItem {
  id: number;
  user_id: number;
  type: string;
  url: string;
  description: string | null;
  total_view: number;
  status: number;
  created_at: string;
  updated_at: string;
  is_view: number;
}

export interface ApiStoryGroup {
  user_id: number;
  user_name: string;
  full_name: string;
  user_image: string | null;
  story: ApiStoryItem[];
}

export type ApiStoriesResponse = ApiListEnvelope<ApiStoryGroup>;
