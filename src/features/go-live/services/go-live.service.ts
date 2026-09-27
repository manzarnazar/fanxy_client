import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type { ApiGeneralSettingsResponse } from "@/types/api/general-setting.types";
import type { ApiSimpleEnvelope } from "@/types/api/common.types";

// get_gift — confirmed against the Flutter app's lib/model/livegiftmodel.dart.
export interface ApiLiveGiftResult {
  id: number;
  name: string;
  image: string | null;
  coin: number;
}

// Endpoint names and payload fields confirmed against the Flutter app's
// lib/webservice/apiservices.dart (general_setting, add_live_user,
// delete_live_user, get_gift) and lib/livestream/golive.dart — not guesses.
// The stream itself (video, chat, viewer presence) runs on ZegoCloud, whose
// credentials come from general_setting; room_id must be the host's
// Firebase document id so mobile viewers can join the same room.
export const goLiveService = {
  getGeneralSettings: () => apiClient.post<ApiGeneralSettingsResponse>("general_setting"),

  startLive: (roomId: string) => apiClient.post<ApiSuccessEnvelope>("add_live_user", { status: 1, room_id: roomId }),

  endLive: () => apiClient.post<ApiSuccessEnvelope>("delete_live_user"),

  getGifts: () => apiClient.post<ApiSimpleEnvelope<ApiLiveGiftResult>>("get_gift"),
};
