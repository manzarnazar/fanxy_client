import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type { ApiPostListResponse } from "@/types/api/post.types";

// Endpoint names and payload fields confirmed against the Flutter app's
// lib/webservice/apiservices.dart (get_user_post, delete_post). There is
// NO dedicated scheduled-posts list endpoint and no edit/reschedule or
// publish-now endpoint — scheduled posts are get_user_post rows with
// is_schedule = 1, auto-published server-side at their schedule datetime.
export const scheduledPostsService = {
  getMyPosts: (creatorId: string, page: number) =>
    apiClient.post<ApiPostListResponse>("get_user_post", { to_user_id: creatorId, page }),

  deletePost: (postId: string) => apiClient.post<ApiSuccessEnvelope>("delete_post", { post_id: postId }),
};
