import type { ApiListEnvelope } from "@/types/api/common.types";

// get_top_fans — confirmed against lib/model/leaderboardmodel.dart.
// Ranks a creator's paying subscribers by lifetime spend.
export interface ApiTopFanResult {
  user_id: number;
  total_spending: string;
  user_full_name: string;
  user_image: string | null;
  user_name: string;
}

export type ApiTopFansResponse = ApiListEnvelope<ApiTopFanResult>;
