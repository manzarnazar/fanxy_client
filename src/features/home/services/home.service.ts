import apiClient from "@/services/api.client";
import type { ApiHomeFeedResponse, ApiLiveUsersResponse, ApiStoriesResponse } from "@/types/api/home.types";

// Endpoint names, HTTP method, and payload fields below are confirmed against
// the real Flutter app's lib/webservice/apiservices.dart (get_post,
// get_story, list_of_live_users, like_unlike, add_view) — not guesses.
// `user_id` is auto-injected by the API client from the signed-in session.
export const homeService = {
  getFeed: (page: number) => apiClient.post<ApiHomeFeedResponse>("get_post", { type: "0", page }),

  getStories: (page: number) => apiClient.post<ApiStoriesResponse>("get_story", { page }),

  getLiveUsers: (page: number) => apiClient.post<ApiLiveUsersResponse>("list_of_live_users", { page }),

  toggleLike: (postId: string) => apiClient.post<{ status: number; message: string }>("like_unlike", { post_id: postId }),

  recordView: (postId: string) => apiClient.post<{ status: number; message: string }>("add_view", { post_id: postId }),
};
