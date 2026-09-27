import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type {
  ApiCoinTransactionsResponse,
  ApiCreatorPackagesResponse,
  ApiEarningsResponse,
  ApiWithdrawalsResponse,
} from "@/types/api/creator-dashboard.types";
import type { ApiPostListResponse } from "@/types/api/post.types";
import type { ApiSettingsProfileResponse } from "@/types/api/settings.types";
import type { WithdrawalRequestInput } from "@/features/creator-dashboard/types/creator-dashboard.types";

// Endpoint names and payload/response fields below are confirmed against
// the real Flutter app's lib/webservice/apiservices.dart (get_profile,
// get_earning_list, get_coin_transaction_list, withdrawal_list,
// coin_withdrawal_request, get_creator_package, get_user_post) — not guesses.
export const creatorDashboardService = {
  getProfile: () => apiClient.post<ApiSettingsProfileResponse>("get_profile"),

  getEarnings: (page: number) => apiClient.post<ApiEarningsResponse>("get_earning_list", { page }),

  getCoinTransactions: (page: number) => apiClient.post<ApiCoinTransactionsResponse>("get_coin_transaction_list", { page }),

  getWithdrawals: (page: number) => apiClient.post<ApiWithdrawalsResponse>("withdrawal_list", { page }),

  requestWithdrawal: (input: WithdrawalRequestInput) =>
    apiClient.post<ApiSuccessEnvelope>("coin_withdrawal_request", {
      coin: input.coin,
      payment_detail: input.paymentDetail,
      payment_type: "",
    }),

  getPackages: (creatorId: string, page: number) =>
    apiClient.post<ApiCreatorPackagesResponse>("get_creator_package", { to_user_id: creatorId, page }),

  getMyPosts: (creatorId: string, page: number) =>
    apiClient.post<ApiPostListResponse>("get_user_post", { to_user_id: creatorId, page }),
};
