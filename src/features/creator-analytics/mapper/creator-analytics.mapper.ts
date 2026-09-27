import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiEarningResult } from "@/types/api/creator-dashboard.types";
import type { ApiPostResult } from "@/types/api/post.types";
import type { ApiTopFanResult } from "@/types/api/subscribers.types";
import type {
  AnalyticsEarning,
  AnalyticsPost,
  AnalyticsTopFan,
} from "@/features/creator-analytics/types/creator-analytics.types";

export function mapApiEarning(row: ApiEarningResult): AnalyticsEarning {
  return {
    id: String(row.id),
    buyerUserId: String(row.user_id),
    buyerName: row.user_name,
    buyerAvatarUrl: sanitizeMediaUrl(row.user_image),
    packageName: row.creator_package_name,
    price: row.price,
    active: row.status === 1,
    createdAt: row.created_at,
  };
}

export function mapApiPost(post: ApiPostResult): AnalyticsPost {
  const primaryContent = post.post_content[0] ?? null;
  const interactions = post.total_like + post.total_comment;
  return {
    id: String(post.id),
    title: post.title || post.description || "Untitled post",
    thumbnailUrl: sanitizeMediaUrl(primaryContent?.image),
    isVideo: primaryContent?.content_type === 2,
    viewCount: post.total_view,
    likeCount: post.total_like,
    commentCount: post.total_comment,
    engagementPercent: post.total_view > 0 ? Math.round((interactions / post.total_view) * 1000) / 10 : 0,
    createdAt: post.created_at,
  };
}

export function mapApiTopFan(row: ApiTopFanResult): AnalyticsTopFan {
  return {
    userId: String(row.user_id),
    name: row.user_full_name,
    avatarUrl: sanitizeMediaUrl(row.user_image),
    totalSpend: Number(row.total_spending) || 0,
  };
}
