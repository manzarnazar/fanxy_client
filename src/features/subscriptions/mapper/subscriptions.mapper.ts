import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiPackageTransactionResult } from "@/types/api/package-transactions.types";
import type { Subscription } from "@/features/subscriptions/types/subscriptions.types";

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function mapApiSubscription(row: ApiPackageTransactionResult, now: Date = new Date()): Subscription {
  // The mobile app trusts the backend-computed status (1 = active) rather
  // than date math; daysLeft is a purely presentational derivation.
  const active = row.status === 1;
  let daysLeft: number | null = null;
  if (active && row.expiry_date) {
    const expiry = new Date(row.expiry_date);
    if (!Number.isNaN(expiry.getTime())) {
      daysLeft = Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / 86_400_000));
    }
  }

  return {
    id: String(row.id),
    creatorId: String(row.to_user_id),
    creatorName: row.creator_name || "Creator",
    creatorAvatarUrl: sanitizeMediaUrl(row.creator_image),
    packageId: String(row.creator_package_id),
    packageName: row.creator_package_name || "Package",
    price: row.price,
    active,
    daysLeft,
    expiryLabel: formatDate(row.expiry_date),
    transactionId: row.transaction_id,
    createdAt: row.created_at,
    startedLabel: formatDate(row.created_at) ?? row.created_at,
  };
}
