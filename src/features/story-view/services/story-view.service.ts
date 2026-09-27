import apiClient from "@/services/api.client";
import type { ApiStoriesResponse } from "@/types/api/story.types";

// Endpoint names, HTTP method, and payload fields below are confirmed
// against the real Flutter app's lib/webservice/apiservices.dart (get_story,
// add_story_view, add_story_report, delete_story) — not guesses. There is no
// real endpoint for story comments, likes, saves, replies, reactions, or
// gifts, so those features have no service methods here.
export const storyViewService = {
  getStories: (page: number) => apiClient.post<ApiStoriesResponse>("get_story", { page }),

  recordView: (storyId: string) => apiClient.post<{ status: number; message: string }>("add_story_view", { story_id: storyId }),

  reportStory: (storyId: string, reportUserId: string, message: string) =>
    apiClient.post<{ status: number; message: string }>("add_story_report", {
      story_id: storyId,
      report_user_id: reportUserId,
      message,
    }),

  deleteStory: (storyId: string) => apiClient.post<{ status: number; message: string }>("delete_story", { story_id: storyId }),
};
