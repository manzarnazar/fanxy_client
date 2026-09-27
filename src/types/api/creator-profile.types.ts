import type { ApiListEnvelope } from "@/types/api/common.types";

/**
 * Real response shape for get_profile, confirmed against the Flutter app's
 * lib/model/profilemodel.dart. Request: { user_id (viewer), to_user_id }.
 * The result array carries a single row. Only the fields the web app
 * consumes are typed here; the real rows also carry bank/KYC/device fields.
 *
 * Note: get_profile returns NO counts (followers/likes/posts) and no
 * subscription price — post count comes from get_user_post's total_rows and
 * prices come from get_creator_package.
 */
export interface ApiProfileResult {
  id: number;
  firebase_id: string | null;
  is_creator: number;
  user_name: string;
  full_name: string;
  email: string;
  country_name: string | null;
  image: string | null;
  cover_img: string | null;
  bio: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  twitter_url: string | null;
  is_verified_at: number;
  is_private: number;
  wallet_amount: number | null;
  coin_wallet: number | null;
  created_at: string;
  is_block: number;
  is_buy: number;
  can_chat: number;
  can_view_live_stream: number;
}

export type ApiProfileResponse = ApiListEnvelope<ApiProfileResult>;
