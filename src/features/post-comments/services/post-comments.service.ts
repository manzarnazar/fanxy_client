import apiClient from "@/services/api.client";
import type { ApiCommentsResponse } from "@/types/api/comments.types";

// Endpoint names and request fields confirmed against the real Flutter
// app's lib/webservice/apiservices.dart (view_comment, add_comment,
// edit_comment, delete_comment) — not guesses. Shared by every feature
// that displays posts (Home feed, Reels) since comments are keyed by
// post_id, not by a feature-specific resource.
export const postCommentsService = {
  getComments: (postId: string) => apiClient.post<ApiCommentsResponse>("view_comment", { post_id: postId }),

  postComment: (postId: string, comment: string) =>
    apiClient.post<{ status: number; message: string }>("add_comment", { post_id: postId, comment }),

  editComment: (postId: string, commentId: string, comment: string) =>
    apiClient.post<{ status: number; message: string }>("edit_comment", { post_id: postId, comment_id: commentId, comment }),

  deleteComment: (commentId: string) =>
    apiClient.post<{ status: number; message: string }>("delete_comment", { comment_id: commentId }),
};
