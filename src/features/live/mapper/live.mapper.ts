import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiLiveUserResult } from "@/types/api/live-user.types";
import type { ApiLiveGiftResult } from "@/types/api/live.types";
import type { LiveGift, LiveStreamCard } from "@/features/live/types/live.types";

export function mapApiLiveUser(row: ApiLiveUserResult): LiveStreamCard {
  return {
    id: String(row.id),
    roomId: row.room_id,
    creatorId: String(row.user_id),
    // The backend bakes an "@" prefix into user_name — strip it everywhere.
    username: row.user_name.replace(/^@+/, ""),
    name: row.full_name || row.user_name.replace(/^@+/, ""),
    avatarUrl: sanitizeMediaUrl(row.image),
    viewerCount: row.total_view,
    isCreator: row.is_creator === 1,
    subscribed: row.is_buy === 1,
    locked: row.is_creator === 1 && row.is_buy !== 1,
  };
}

export function mapApiLiveGift(row: ApiLiveGiftResult): LiveGift {
  return {
    id: String(row.id),
    name: row.name,
    imageUrl: sanitizeMediaUrl(row.image),
    coin: row.coin,
  };
}
