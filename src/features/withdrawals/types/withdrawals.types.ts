export type WithdrawalStatusFilter = "all" | "pending" | "approved";

export type WithdrawalsSort = "newest" | "oldest" | "highest" | "lowest";

/**
 * One row from withdrawal_list. The backend status is a bare int the mobile
 * app never even displays — the only established meaning is 1 = approved,
 * everything else = pending.
 */
export interface Withdrawal {
  id: string;
  amountCoins: number;
  paymentType: string | null;
  paymentDetail: string | null;
  approved: boolean;
  createdAt: string;
  dateLabel: string;
}

export interface WithdrawalRequestInput {
  coin: number;
  paymentDetail: string;
}
