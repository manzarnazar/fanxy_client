import type { ApiSimpleEnvelope } from "@/types/api/common.types";

// Field list confirmed against the real Flutter app's lib/model/profilemodel.dart
// (get_profile) — every field below is real, not a guess.
export interface ApiSettingsProfile {
  id: number;
  firebase_id: string | null;
  is_creator: number;
  user_name: string;
  full_name: string;
  email: string;
  country_code: string | null;
  mobile_number: string | null;
  country_name: string | null;
  image: string | null;
  cover_img: string | null;
  gender: string | null;
  date_of_birth: string | null;
  bio: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  twitter_url: string | null;
  is_verified_at: number | null;
  is_private: number;
  wallet_amount: number | null;
  coin_wallet: number | null;
  earned_coin: number | null;
  bank_name: string | null;
  account_no: string | null;
  ifsc_no: string | null;
  front_id_proof_img: string | null;
  back_id_proof_img: string | null;
  created_at: string;
  updated_at: string;
}

export type ApiSettingsProfileResponse = ApiSimpleEnvelope<ApiSettingsProfile>;

// get_pages API — confirmed against lib/model/pagesmodel.dart.
export interface ApiSettingsPage {
  page_name: string;
  title: string;
  url: string;
  icon: string | null;
}

export type ApiSettingsPagesResponse = ApiSimpleEnvelope<ApiSettingsPage>;

// get_social_links API — confirmed against lib/model/sociallinkmodel.dart.
export interface ApiSocialLink {
  id: number;
  name: string;
  image: string | null;
  url: string;
  status: number;
}

export type ApiSocialLinksResponse = ApiSimpleEnvelope<ApiSocialLink>;
