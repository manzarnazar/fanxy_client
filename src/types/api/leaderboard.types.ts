import type { ApiListEnvelope } from "@/types/api/common.types";

// get_top_creators — confirmed against lib/model/leaderboardmodel.dart
// (TopCreatorResult). Ranks creators globally by lifetime earnings.
export interface ApiTopCreatorResult {
  to_user_id: number;
  total_earning: string | number | null;
  full_name: string;
  user_image: string | null;
  user_name: string;
}

export type ApiTopCreatorsResponse = ApiListEnvelope<ApiTopCreatorResult>;
