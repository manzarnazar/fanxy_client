import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiTopFanResult } from "@/types/api/subscribers.types";
import type { ApiTopCreatorResult } from "@/types/api/leaderboard.types";
import type { LeaderboardEntry } from "@/features/leaderboard/types/leaderboard.types";

// The backend bakes an "@" prefix into user_name — strip it everywhere.
const stripAt = (value: string) => value.replace(/^@+/, "");

export function mapApiTopFan(row: ApiTopFanResult, index: number): LeaderboardEntry {
  const username = stripAt(row.user_name);
  return {
    userId: String(row.user_id),
    rank: index + 1,
    name: row.user_full_name || username,
    username,
    avatarUrl: sanitizeMediaUrl(row.user_image),
    amount: Number(row.total_spending) || 0,
  };
}

export function mapApiTopCreator(row: ApiTopCreatorResult, index: number): LeaderboardEntry {
  const username = stripAt(row.user_name);
  return {
    userId: String(row.to_user_id),
    rank: index + 1,
    name: row.full_name || username,
    username,
    avatarUrl: sanitizeMediaUrl(row.user_image),
    amount: Number(row.total_earning) || 0,
  };
}
