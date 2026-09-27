import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiGeneralSettingResult } from "@/types/api/general-setting.types";
import type { ApiLiveGiftResult } from "@/features/go-live/services/go-live.service";
import type { LiveGift, ZegoLiveConfig } from "@/features/go-live/types/go-live.types";

/**
 * Pulls the ZegoCloud credentials out of the general_setting key/value list
 * (keys live_appid / live_serversecret — same source the mobile app reads).
 * Returns null when live streaming isn't configured for this deployment.
 */
export function mapZegoConfig(rows: ApiGeneralSettingResult[]): ZegoLiveConfig | null {
  const byKey = new Map(rows.map((row) => [row.key, row.value]));
  const appId = Number(byKey.get("live_appid"));
  const serverSecret = byKey.get("live_serversecret");
  if (!appId || Number.isNaN(appId) || !serverSecret) return null;
  return { appId, serverSecret };
}

export function mapLiveGift(row: ApiLiveGiftResult): LiveGift {
  return {
    id: String(row.id),
    name: row.name,
    imageUrl: sanitizeMediaUrl(row.image),
    coins: row.coin,
  };
}
