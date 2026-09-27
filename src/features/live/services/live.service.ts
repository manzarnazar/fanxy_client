import apiClient from "@/services/api.client";
import type { ApiSimpleEnvelope, ApiSuccessEnvelope } from "@/types/api/common.types";
import type { ApiLiveUsersResponse } from "@/types/api/live-user.types";
import type { ApiLiveGiftResult } from "@/types/api/live.types";
import type { LiveZegoConfig } from "@/features/live/types/live.types";

// Endpoint names and payload fields confirmed against the Flutter app's
// lib/webservice/apiservices.dart + lib/livestream/* (list_of_live_users,
// get_gift, send_gift). The gift ANIMATION broadcast goes through Zego's
// demo relay server — the exact same hardcoded URL and payload the mobile
// app uses (lib/livestream/golive.dart _sendGift) — while the coin
// deduction is recorded by the backend send_gift call.
const ZEGO_GIFT_RELAY_URL = "https://zego-example-server-nextjs.vercel.app/api/send_gift";

export interface BroadcastGiftInput {
  config: LiveZegoConfig;
  roomId: string;
  userFirebaseId: string;
  userName: string;
  giftId: string;
}

export const liveService = {
  listLiveUsers: (page: number) => apiClient.post<ApiLiveUsersResponse>("list_of_live_users", { page }),

  getGifts: () => apiClient.post<ApiSimpleEnvelope<ApiLiveGiftResult>>("get_gift"),

  sendGift: (toUserId: string, giftId: string, description: string, transactionId: string) =>
    apiClient.post<ApiSuccessEnvelope>("send_gift", {
      to_user_id: toUserId,
      gift_id: giftId,
      description,
      transaction_id: transactionId,
    }),

  broadcastGift: async (input: BroadcastGiftInput): Promise<void> => {
    const response = await fetch(ZEGO_GIFT_RELAY_URL, {
      method: "POST",
      body: JSON.stringify({
        app_id: input.config.appId,
        server_secret: input.config.serverSecret,
        room_id: input.roomId,
        user_id: input.userFirebaseId,
        user_name: input.userName,
        gift_type: 1001,
        // The mobile app repurposes gift_count to carry the gift id — kept
        // byte-identical so mobile viewers render the right animation.
        gift_count: Number(input.giftId),
        timestamp: Date.now(),
        transaction_id: "",
        description: "",
      }),
    });
    if (!response.ok) throw new Error("Gift broadcast failed.");
  },
};
