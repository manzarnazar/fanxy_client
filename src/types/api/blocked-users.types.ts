import type { ApiListEnvelope } from "@/types/api/common.types";

// user_block_list — confirmed against the Flutter app's
// lib/model/blocklistmodel.dart. Request: { user_id, page }.
export interface ApiBlockedUserResult {
  id: number;
  user_id: number;
  block_user_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  user_name: string;
  full_name: string;
  image: string | null;
}

export type ApiBlockedUsersResponse = ApiListEnvelope<ApiBlockedUserResult>;
