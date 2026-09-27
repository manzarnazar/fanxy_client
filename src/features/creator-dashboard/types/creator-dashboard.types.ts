export interface WalletSnapshot {
  walletBalance: number;
  coinBalance: number;
  earnedCoins: number;
}

export interface CreatorPackageItem {
  id: string;
  name: string;
  price: number;
  durationLabel: string;
  imageUrl: string | null;
}

export interface ContentPerformanceItem {
  id: string;
  title: string | null;
  thumbnailUrl: string | null;
  isVideo: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface ScheduledPostSummary {
  id: string;
  title: string | null;
  thumbnailUrl: string | null;
  scheduleDateLabel: string;
}

export interface EarningItem {
  id: string;
  packageName: string | null;
  buyerName: string;
  buyerAvatarUrl: string | null;
  price: number;
  createdAtLabel: string;
}

export interface CoinTransactionItem {
  id: string;
  packageName: string | null;
  coin: number;
  createdAtLabel: string;
}

export interface WithdrawalItem {
  id: string;
  amount: number;
  paymentType: string | null;
  approved: boolean;
  createdAtLabel: string;
}

export interface CreatorDashboardBundle {
  wallet: WalletSnapshot;
  packages: CreatorPackageItem[];
  contentPerformance: ContentPerformanceItem[];
  scheduledPosts: ScheduledPostSummary[];
  earnings: EarningItem[];
  coinTransactions: CoinTransactionItem[];
  withdrawals: WithdrawalItem[];
}

export interface WithdrawalRequestInput {
  coin: number;
  paymentDetail: string;
}
