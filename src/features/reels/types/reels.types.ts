export interface Reel {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorFullName: string;
  creatorAvatarUrl: string | null;
  isCreator: boolean;
  createdAt: string;
  title: string | null;
  description: string | null;
  videoUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  locked: boolean;
  commentsEnabled: boolean;
  // The real backend has no follow/subscribe-toggle endpoints (relationships
  // are subscription-purchase-only), so these are local-only UI state,
  // always false from the API and toggled optimistically without a network call.
  followedByMe: boolean;
  subscribedByMe: boolean;
}
