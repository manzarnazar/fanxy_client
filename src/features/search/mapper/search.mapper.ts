import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiSearchUserResult } from "@/types/api/search.types";
import type { SearchResult } from "@/features/search/types/search.types";

export function mapApiSearchUser(row: ApiSearchUserResult): SearchResult {
  return {
    id: String(row.id),
    name: row.full_name || row.user_name,
    username: row.user_name,
    avatarUrl: sanitizeMediaUrl(row.image),
    bio: row.bio,
    verified: row.is_verified_at === 1,
    isCreator: row.is_creator === 1,
  };
}
