/** One purchasable coin pack from get_coin_package. */
export interface CoinPack {
  id: string;
  name: string;
  price: number;
  coins: number;
  imageUrl: string | null;
}

/** One row from get_coin_transaction_list (coin pack purchases). */
export interface CoinTransaction {
  id: string;
  packName: string | null;
  price: number | null;
  coins: number;
  transactionId: string | null;
  description: string | null;
  completed: boolean;
  createdAt: string;
  dateLabel: string;
}
