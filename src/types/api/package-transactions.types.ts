import type { ApiListEnvelope } from "@/types/api/common.types";

// get_creator_package_transaction_list — confirmed against the Flutter app's
// lib/model/packagetransactionsmodel.dart. The fan's own package purchases,
// with creator/package details joined in. status 1 = currently active
// (computed server-side from the package duration).
export interface ApiPackageTransactionResult {
  id: number;
  user_id: number;
  to_user_id: number;
  creator_package_id: number;
  price: number;
  transaction_id: string | null;
  description: string | null;
  expiry_date: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  creator_package_name: string | null;
  creator_name: string | null;
  creator_image: string | null;
}

export type ApiPackageTransactionsResponse = ApiListEnvelope<ApiPackageTransactionResult>;
