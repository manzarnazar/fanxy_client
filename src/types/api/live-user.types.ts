import type { ApiListEnvelope } from "@/types/api/common.types";

// Real response shape for list_of_live_users, confirmed against the Flutter
// app's lib/model/livestreammodel.dart.
export interface ApiLiveUserResult {
  id: number;
  room_id: string;
  user_id: number;
  total_view: number;
  status: number;
  created_at: string;
  updated_at: string;
  user_name: string;
  full_name: string;
  email: string;
  mobile_number: string | null;
  image: string | null;
  is_private: number;
  is_creator: number;
  is_buy: number;
  can_view_live_stream: number;
}

export type ApiLiveUsersResponse = ApiListEnvelope<ApiLiveUserResult>;
