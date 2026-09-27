import type { ApiWithdrawalResult } from "@/types/api/creator-dashboard.types";
import type { Withdrawal } from "@/features/withdrawals/types/withdrawals.types";

export function mapApiWithdrawal(row: ApiWithdrawalResult): Withdrawal {
  const created = new Date(row.created_at);
  return {
    id: String(row.id),
    amountCoins: row.amount,
    paymentType: row.payment_type,
    paymentDetail: row.payment_detail,
    approved: row.status === 1,
    createdAt: row.created_at,
    dateLabel: Number.isNaN(created.getTime())
      ? row.created_at
      : created.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
  };
}
