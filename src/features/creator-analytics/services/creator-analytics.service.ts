import apiClient from "@/services/api.client";
import type { ApiEarningsResponse } from "@/types/api/creator-dashboard.types";
import type { ApiPostListResponse } from "@/types/api/post.types";
import type { ApiTopFansResponse } from "@/types/api/subscribers.types";

// Endpoint names and request fields confirmed against the real Flutter app's
// lib/webservice/apiservices.dart (get_earning_list, get_top_fans,
// get_user_post) — not guesses. The backend has NO dedicated analytics
// endpoint and no date-range params; everything on the Analytics page is
// derived client-side from these three real sources.
export const creatorAnalyticsService = {
  getEarnings: (page: number) => apiClient.post<ApiEarningsResponse>("get_earning_list", { page }),

  getTopFans: (userId: string) => {
    const form = new FormData();
    form.append("user_id", userId);
    return apiClient.post<ApiTopFansResponse>("get_top_fans", form);
  },

  getMyPosts: (creatorId: string, page: number) =>
    apiClient.post<ApiPostListResponse>("get_user_post", { to_user_id: creatorId, page }),
};
