import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type { ApiBlockedUsersResponse } from "@/types/api/blocked-users.types";

// Endpoint names and payload fields confirmed against the Flutter app's
// lib/webservice/apiservices.dart (user_block_list, add_remove_user_block).
// add_remove_user_block is a TOGGLE — the same endpoint blocks and unblocks.
export const blockedUsersService = {
  getBlockList: (page: number) => apiClient.post<ApiBlockedUsersResponse>("user_block_list", { page }),

  toggleBlock: (blockUserId: string) =>
    apiClient.post<ApiSuccessEnvelope>("add_remove_user_block", { block_user_id: blockUserId }),
};
