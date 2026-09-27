import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type { ApiProfileResponse } from "@/types/api/creator-profile.types";
import type { ApiPostListResponse } from "@/types/api/post.types";

// Endpoint names and payload fields confirmed against the Flutter app's
// lib/webservice/apiservices.dart (get_profile, get_user_post,
// add_remove_user_block). The viewer's user_id is auto-injected by the API
// client; the profile being viewed is always to_user_id. The backend has no
// follow endpoint — relationships are subscription-only (is_buy).
export const creatorProfileService = {
  getProfile: (toUserId: string) =>
    apiClient.post<ApiProfileResponse>("get_profile", { to_user_id: toUserId }),

  getPosts: (toUserId: string, page: number) =>
    apiClient.post<ApiPostListResponse>("get_user_post", { to_user_id: toUserId, page }),

  toggleBlock: (blockUserId: string) =>
    apiClient.post<ApiSuccessEnvelope>("add_remove_user_block", { block_user_id: blockUserId }),
};
