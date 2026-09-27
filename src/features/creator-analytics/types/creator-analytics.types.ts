export type AnalyticsRangeKey = "7d" | "30d" | "90d" | "year" | "all";

/** One purchase transaction from get_earning_list, in domain shape. */
export interface AnalyticsEarning {
  id: string;
  buyerUserId: string;
  buyerName: string;
  buyerAvatarUrl: string | null;
  packageName: string | null;
  price: number;
  active: boolean;
  createdAt: string;
}

/** One of the creator's own posts from get_user_post, in domain shape. */
export interface AnalyticsPost {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  isVideo: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  /** (likes + comments) / views — derived client-side, 0 when the post has no views. */
  engagementPercent: number;
  createdAt: string;
}

export interface AnalyticsTopFan {
  userId: string;
  name: string;
  avatarUrl: string | null;
  totalSpend: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface PackageRevenueSlice {
  packageName: string;
  totalRevenue: number;
  percent: number;
}

/** Everything derivable from the loaded earnings + posts for the active range. */
export interface AnalyticsSummary {
  totalRevenue: number;
  transactionCount: number;
  uniqueBuyers: number;
  newSubscribers: number;
  renewals: number;
  activeSubscribers: number;
  expiredSubscribers: number;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  engagementPercent: number;
  avgViewsPerPost: number;
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
}
