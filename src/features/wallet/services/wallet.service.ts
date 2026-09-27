import apiClient from "@/services/api.client";
import type { ApiCoinTransactionsResponse } from "@/types/api/creator-dashboard.types";
import type { ApiCoinPackagesResponse } from "@/types/api/payments.types";

// Endpoint names confirmed against the Flutter app's
// lib/webservice/apiservices.dart (get_coin_package,
// get_coin_transaction_list). Purchases themselves run through the
// existing /payment checkout (Razorpay + add_coin_transaction).
export const walletService = {
  getCoinPackages: () => apiClient.post<ApiCoinPackagesResponse>("get_coin_package"),

  getCoinTransactions: (page: number) =>
    apiClient.post<ApiCoinTransactionsResponse>("get_coin_transaction_list", { page }),
};
