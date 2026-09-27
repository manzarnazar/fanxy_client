import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiCoinTransactionResult } from "@/types/api/creator-dashboard.types";
import type { ApiCoinPackageResult } from "@/types/api/payments.types";
import type { CoinPack, CoinTransaction } from "@/features/wallet/types/wallet.types";

export function mapCoinPack(row: ApiCoinPackageResult): CoinPack {
  return {
    id: String(row.id),
    name: row.name,
    price: row.price,
    coins: row.coin,
    imageUrl: sanitizeMediaUrl(row.image),
  };
}

export function mapCoinTransaction(row: ApiCoinTransactionResult): CoinTransaction {
  const created = new Date(row.created_at);
  return {
    id: String(row.id),
    packName: row.coin_package_name,
    price: row.price !== null ? Number(row.price) || null : null,
    coins: row.coin,
    transactionId: row.transaction_id,
    description: row.description,
    completed: row.status === 1,
    createdAt: row.created_at,
    dateLabel: Number.isNaN(created.getTime())
      ? row.created_at
      : created.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
  };
}
