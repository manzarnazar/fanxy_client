import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type { ApiEarningsResponse } from "@/types/api/creator-dashboard.types";
import type { ApiTopFansResponse } from "@/types/api/subscribers.types";

// Endpoint names and request fields confirmed against the real Flutter
// app's lib/webservice/apiservices.dart (get_earning_list, get_top_fans,
// add_remove_user_block) — not guesses. There is no dedicated
// "subscriber list" endpoint; subscribers are derived from the creator's
// own earning transactions (get_earning_list), grouped by paying user.
export const subscribersService = {
  getEarnings: (page: number) => apiClient.post<ApiEarningsResponse>("get_earning_list", { page }),

  getTopFans: (userId: string) => {
    const form = new FormData();
    form.append("user_id", userId);
    return apiClient.post<ApiTopFansResponse>("get_top_fans", form);
  },

  toggleBlock: (blockUserId: string) =>
    apiClient.post<ApiSuccessEnvelope>("add_remove_user_block", { block_user_id: blockUserId }),
};
