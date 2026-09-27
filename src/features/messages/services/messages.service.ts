import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type { ApiSearchUsersResponse } from "@/types/api/search.types";

// Chat data itself lives in Firestore (see chat.service.ts) — the REST layer
// only covers people search and blocking. Both endpoints are confirmed
// against the Flutter app's lib/webservice/apiservices.dart (search_user,
// add_remove_user_block) — not guesses.
export const messagesService = {
  searchUsers: (name: string, page = 1) =>
    apiClient.post<ApiSearchUsersResponse>("search_user", { name, page }),

  toggleBlock: (blockUserId: string) =>
    apiClient.post<ApiSuccessEnvelope>("add_remove_user_block", { block_user_id: blockUserId }),
};
