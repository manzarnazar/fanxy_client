import type { ApiListEnvelope } from "@/types/api/common.types";

// get_earning_list — confirmed against lib/model/creatorearningsmodel.dart.
// Real earnings from subscribers buying this creator's packages.
export interface ApiEarningResult {
  id: number;
  user_id: number;
  to_user_id: number;
  creator_package_id: string | null;
  price: number;
  transaction_id: string | null;
  description: string | null;
  expiry_date: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  creator_package_name: string | null;
  user_name: string;
  user_image: string | null;
}

export type ApiEarningsResponse = ApiListEnvelope<ApiEarningResult>;

// get_coin_transaction_list — confirmed against lib/model/cointransactionsmodel.dart.
export interface ApiCoinTransactionResult {
  id: number;
  user_id: number;
  coin_package_id: string | null;
  price: string | null;
  coin: number;
  transaction_id: string | null;
  description: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  coin_package_name: string | null;
}

export type ApiCoinTransactionsResponse = ApiListEnvelope<ApiCoinTransactionResult>;

// withdrawal_list — confirmed against lib/model/withdrawallistmodel.dart.
export interface ApiWithdrawalResult {
  id: number;
  user_id: number;
  amount: number;
  payment_type: string | null;
  payment_detail: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

export type ApiWithdrawalsResponse = ApiListEnvelope<ApiWithdrawalResult>;

// get_creator_package — confirmed against lib/model/packagemodel.dart.
export interface ApiCreatorPackageResult {
  id: number;
  user_id: number;
  name: string;
  price: number;
  time: number;
  type: string | null;
  image: string | null;
  status: number;
  created_at: string;
}

export type ApiCreatorPackagesResponse = ApiListEnvelope<ApiCreatorPackageResult>;
