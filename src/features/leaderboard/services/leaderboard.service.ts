import apiClient from "@/services/api.client";
import type { ApiTopFansResponse } from "@/types/api/subscribers.types";
import type { ApiTopCreatorsResponse } from "@/types/api/leaderboard.types";

// Endpoint names and payload fields confirmed against the Flutter app's
// lib/webservice/apiservices.dart + lib/pages/leaderboard.dart:
// get_top_fans ranks ONE creator's supporters (user_id = that creator);
// get_top_creators is global (user_id = the viewer, auto-injected).
// Both are multipart in the mobile app, mirrored here with FormData.
export const leaderboardService = {
  getTopFans: (creatorId: string) => {
    const form = new FormData();
    form.append("user_id", creatorId);
    return apiClient.post<ApiTopFansResponse>("get_top_fans", form);
  },

  getTopCreators: () => apiClient.post<ApiTopCreatorsResponse>("get_top_creators", new FormData()),
};
