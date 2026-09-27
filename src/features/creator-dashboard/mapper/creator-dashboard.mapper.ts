import { formatRelativeTime } from "@/lib/formatter/relativeTime";
import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type {
  ApiCoinTransactionResult,
  ApiCreatorPackageResult,
  ApiEarningResult,
  ApiWithdrawalResult,
} from "@/types/api/creator-dashboard.types";
import type { ApiPostResult } from "@/types/api/post.types";
import type {
  CoinTransactionItem,
  ContentPerformanceItem,
  CreatorPackageItem,
  EarningItem,
  ScheduledPostSummary,
  WithdrawalItem,
} from "@/features/creator-dashboard/types/creator-dashboard.types";

export function mapApiCreatorPackage(item: ApiCreatorPackageResult): CreatorPackageItem {
  return {
    id: String(item.id),
    name: item.name,
    price: item.price,
    durationLabel: item.type ? `${item.time} ${item.type}` : String(item.time),
    imageUrl: sanitizeMediaUrl(item.image),
  };
}

function firstThumbnail(post: ApiPostResult): { url: string | null; isVideo: boolean } {
  const content = post.post_content[0];
  if (!content) return { url: null, isVideo: false };
  if (content.content_type === 2) return { url: sanitizeMediaUrl(content.image), isVideo: true };
  return { url: sanitizeMediaUrl(content.image), isVideo: false };
}

export function mapApiContentPerformance(post: ApiPostResult): ContentPerformanceItem {
  const thumbnail = firstThumbnail(post);
  return {
    id: String(post.id),
    title: post.title,
    thumbnailUrl: thumbnail.url,
    isVideo: thumbnail.isVideo,
    viewCount: post.total_view,
    likeCount: post.total_like,
    commentCount: post.total_comment,
  };
}

export function mapApiScheduledPost(post: ApiPostResult): ScheduledPostSummary {
  const thumbnail = firstThumbnail(post);
  const when = [post.schedule_date, post.schedule_time].filter(Boolean).join(" ");
  return {
    id: String(post.id),
    title: post.title,
    thumbnailUrl: thumbnail.url,
    scheduleDateLabel: when || "Scheduled",
  };
}

export function mapApiEarning(item: ApiEarningResult): EarningItem {
  return {
    id: String(item.id),
    packageName: item.creator_package_name,
    buyerName: item.user_name,
    buyerAvatarUrl: sanitizeMediaUrl(item.user_image),
    price: item.price,
    createdAtLabel: formatRelativeTime(item.created_at),
  };
}

export function mapApiCoinTransaction(item: ApiCoinTransactionResult): CoinTransactionItem {
  return {
    id: String(item.id),
    packageName: item.coin_package_name,
    coin: item.coin,
    createdAtLabel: formatRelativeTime(item.created_at),
  };
}

export function mapApiWithdrawal(item: ApiWithdrawalResult): WithdrawalItem {
  return {
    id: String(item.id),
    amount: item.amount,
    paymentType: item.payment_type,
    approved: item.status === 1,
    createdAtLabel: formatRelativeTime(item.created_at),
  };
}
