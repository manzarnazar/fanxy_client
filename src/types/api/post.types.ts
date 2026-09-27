import type { ApiListEnvelope } from "@/types/api/common.types";

/**
 * Real response shape for get_post / get_user_post, confirmed against the
 * Flutter app's lib/model/postmodel.dart. The backend has no separate "reel"
 * resource — reels are posts whose content_type is video.
 */
export interface ApiPostContent {
  id: number;
  post_id: number;
  content_type: number; // 1 = Image, 2 = Video (per image_upload's documented codes)
  video: string | null;
  image: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface ApiPostResult {
  id: number;
  user_id: number;
  hashtag_id: string | null;
  title: string | null;
  description: string | null;
  is_comment: number;
  total_view: number;
  total_like: number;
  status: number;
  created_at: string;
  updated_at: string;
  post_content: ApiPostContent[];
  user_name: string;
  full_name: string;
  email: string;
  country_code: string | null;
  mobile_number: string | null;
  country_name: string | null;
  profile_img: string | null;
  is_private: number;
  is_creator: number;
  total_comment: number;
  is_like: number;
  is_buy: number;
  is_schedule: number;
  schedule_date: string | null;
  schedule_time: string | null;
  is_new_user_discount: number;
  new_user_discount: number;
  promo_code: string | null;
}

export type ApiPostListResponse = ApiListEnvelope<ApiPostResult>;
