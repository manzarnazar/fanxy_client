import apiClient from "@/services/api.client";
import type { ApiSearchUsersResponse } from "@/types/api/search.types";

// search_user — confirmed against the Flutter app's
// lib/webservice/apiservices.dart. It is the backend's only search endpoint;
// posts/reels/hashtags/live have no search API.
export const searchService = {
  searchUsers: (name: string, page: number) =>
    apiClient.post<ApiSearchUsersResponse>("search_user", { name, page }),
};
