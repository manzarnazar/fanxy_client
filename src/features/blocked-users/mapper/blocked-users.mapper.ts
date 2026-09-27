import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiBlockedUserResult } from "@/types/api/blocked-users.types";
import type { BlockedUser } from "@/features/blocked-users/types/blocked-users.types";

export function mapApiBlockedUser(row: ApiBlockedUserResult): BlockedUser {
  // The backend bakes an "@" prefix into user_name — strip it everywhere.
  const username = row.user_name.replace(/^@+/, "");
  return {
    id: String(row.id),
    blockUserId: String(row.block_user_id),
    username,
    name: row.full_name || username,
    avatarUrl: sanitizeMediaUrl(row.image),
    blockedAt: row.created_at,
  };
}
