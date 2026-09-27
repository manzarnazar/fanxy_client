import apiClient from "@/services/api.client";
import type { ApiReelsResponse } from "@/types/api/reels.types";

// Endpoint names, HTTP method, and payload fields below are confirmed against
// the real Flutter app's lib/webservice/apiservices.dart (get_post,
// like_unlike, add_report) — not guesses. `user_id` is auto-injected by the
// API client. Reels are get_post results filtered to video content
// client-side; there is no separate reel resource, and no category/sort/
// comment-like/save/subscribe endpoints exist on the real backend.
// Comment CRUD moved to the shared features/post-comments module.
export const reelsService = {
  getReels: (page: number) => apiClient.post<ApiReelsResponse>("get_post", { type: "0", page }),

  toggleLike: (postId: string) => apiClient.post<{ status: number; message: string }>("like_unlike", { post_id: postId }),

  reportReel: (postId: string, reason: string) =>
    apiClient.post<{ status: number; message: string }>("add_report", { post_id: postId, reason }),
};
