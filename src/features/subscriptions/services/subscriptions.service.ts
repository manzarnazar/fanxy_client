import apiClient from "@/services/api.client";
import type { ApiPackageTransactionsResponse } from "@/types/api/package-transactions.types";

// get_creator_package_transaction_list — confirmed against the Flutter app's
// lib/webservice/apiservices.dart (getUserTransactions). There is NO cancel,
// auto-renew or renew endpoint — renewal is a fresh purchase via checkout.
export const subscriptionsService = {
  getMySubscriptions: (page: number) =>
    apiClient.post<ApiPackageTransactionsResponse>("get_creator_package_transaction_list", { page }),
};
