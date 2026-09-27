import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type { ApiWithdrawalsResponse } from "@/types/api/creator-dashboard.types";
import type { WithdrawalRequestInput } from "@/features/withdrawals/types/withdrawals.types";

// Endpoint names and payload fields confirmed against the Flutter app's
// lib/webservice/apiservices.dart (withdrawal_list, coin_withdrawal_request).
// The request is denominated in COINS with a free-text payment_detail and an
// always-empty payment_type — there are no fee/minimum/rate parameters
// anywhere in the real contract.
export const withdrawalsService = {
  getWithdrawals: (page: number) => apiClient.post<ApiWithdrawalsResponse>("withdrawal_list", { page }),

  requestWithdrawal: (input: WithdrawalRequestInput) =>
    apiClient.post<ApiSuccessEnvelope>("coin_withdrawal_request", {
      coin: input.coin,
      payment_detail: input.paymentDetail,
      payment_type: "",
    }),
};
