import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type { ApiImageUploadResponse } from "@/types/api/my-content.types";
import type { ApiPostListResponse } from "@/types/api/post.types";
import type { ApiStoriesResponse } from "@/types/api/story.types";
import type { ContentMediaType, UploadPostInput } from "@/features/my-content/types/my-content.types";

// Endpoint names, request fields, and response shapes below are confirmed
// against the real Flutter app's lib/webservice/apiservices.dart
// (get_user_post, get_user_story, delete_post, delete_story, image_upload,
// upload_post) — not guesses. There is no edit/update-post, bulk-delete,
// restore, or per-post-analytics endpoint, and no server-side search/sort
// on get_user_post.
export const myContentService = {
  getUserPosts: (userId: string, page: number) =>
    apiClient.post<ApiPostListResponse>("get_user_post", { to_user_id: userId, page }),

  getUserStories: (userId: string, page: number) =>
    apiClient.post<ApiStoriesResponse>("get_user_story", { to_user_id: userId, page }),

  deletePost: (postId: string) => apiClient.post<ApiSuccessEnvelope>("delete_post", { post_id: postId }),

  deleteStory: (storyId: string) => apiClient.post<ApiSuccessEnvelope>("delete_story", { story_id: storyId }),

  // upload_story — confirmed against lib/webservice/apiservices.dart:614.
  // Single multipart call: the media file goes directly in `url` (no separate
  // image_upload step, unlike posts).
  uploadStory: (description: string, mediaType: ContentMediaType, file: File) => {
    const form = new FormData();
    form.append("description", description);
    form.append("type", mediaType);
    form.append("url", file);
    return apiClient.post<ApiSuccessEnvelope>("upload_story", form);
  },

  uploadImage: (file: File, mediaType: ContentMediaType, coverFile: File | null) => {
    const form = new FormData();
    form.append("content_type", mediaType === "video" ? "2" : "1");
    if (mediaType === "video") {
      form.append("image", coverFile ?? "");
      form.append("video", file);
    } else {
      form.append("image", file);
      form.append("video", "");
    }
    return apiClient.post<ApiImageUploadResponse>("image_upload", form);
  },

  // NOTE: `post_content`'s exact multipart wire encoding for a nested array
  // could not be confirmed from the Dart source alone (Dio's
  // FormData.fromMap on a raw List<Map>). JSON-encoding it as a single
  // string field is the documented safe bet from the Flutter source but is
  // unverified against a live request — confirm before relying on this.
  uploadPost: (input: UploadPostInput, contents: PostContentPayload[]) => {
    const form = new FormData();
    form.append("is_comment", input.isCommentEnabled ? "1" : "0");
    form.append("is_schedule", input.isScheduled ? "1" : "0");
    if (input.isScheduled) {
      form.append("schedule_date", input.scheduleDate);
      form.append("schedule_time", input.scheduleTime);
    }
    form.append("title", input.title);
    form.append("descripation", input.description);
    form.append("post_content", JSON.stringify(contents));
    return apiClient.post<ApiSuccessEnvelope>("upload_post", form);
  },
};

/** One entry of upload_post's post_content — file NAMES from image_upload. */
export interface PostContentPayload {
  content_type: number;
  image: string;
  video: string;
}
