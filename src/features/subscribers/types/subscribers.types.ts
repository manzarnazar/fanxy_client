export type SubscriberStatus = "active" | "expired";
export type SubscribersViewMode = "grid" | "list";
export type SubscribersStatusFilter = "all" | "active" | "expired";
export type SubscribersSort = "recent" | "revenue" | "alphabetical" | "longest";

export interface SubscriptionTransaction {
  id: string;
  packageName: string | null;
  price: number;
  status: SubscriberStatus;
  createdAt: string;
  dateLabel: string;
  expiryLabel: string | null;
}

export interface Subscriber {
  userId: string;
  name: string;
  avatarUrl: string | null;
  packageName: string | null;
  status: SubscriberStatus;
  lifetimeSpend: number;
  transactionCount: number;
  firstTransactionAt: string;
  lastTransactionAt: string;
  lastTransactionLabel: string;
  transactions: SubscriptionTransaction[];
  blocked: boolean;
}

export interface TopSupporter {
  userId: string;
  name: string;
  avatarUrl: string | null;
  totalSpend: number;
}

export interface PackageRevenueBreakdown {
  packageName: string;
  totalRevenue: number;
  percent: number;
}
