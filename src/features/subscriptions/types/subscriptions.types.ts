export type SubscriptionStatusFilter = "all" | "active" | "expiring" | "expired";

export type SubscriptionsSort = "newest" | "oldest" | "expiry";

/**
 * One of the fan's package purchases. Subscriptions are time-based on the
 * backend — no cancel or auto-renew exists; an expired one is renewed by
 * simply buying the package again through checkout.
 */
export interface Subscription {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatarUrl: string | null;
  packageId: string;
  packageName: string;
  price: number;
  active: boolean;
  /** Days until expiry for active subscriptions; null when unknown or expired. */
  daysLeft: number | null;
  expiryLabel: string | null;
  transactionId: string | null;
  createdAt: string;
  startedLabel: string;
}
