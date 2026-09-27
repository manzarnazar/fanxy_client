export type CreatorSocialPlatform = "instagram" | "facebook" | "youtube" | "x";

export interface CreatorSocialLink {
  platform: CreatorSocialPlatform;
  url: string;
}

export interface CreatorProfile {
  id: string;
  firebaseId: string | null;
  username: string;
  name: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
  countryName: string | null;
  isCreator: boolean;
  verified: boolean;
  isPrivate: boolean;
  /** Viewer has an active subscription/purchase with this creator (is_buy). */
  subscribed: boolean;
  /** Viewer's active package allows chat (can_chat). */
  canChat: boolean;
  /** Viewer's active package allows watching live streams (can_view_live_stream). */
  canViewLiveStream: boolean;
  /** Viewer has blocked this user (is_block). */
  blocked: boolean;
  memberSince: string;
  socialLinks: CreatorSocialLink[];
}

export type ProfilePostMediaType = "image" | "video";

export interface ProfilePostMediaItem {
  id: string;
  type: ProfilePostMediaType;
  /** Playable source: the video file for type "video", the image file for type "image". */
  url: string | null;
  /** Poster/cover image — present for both image and video content items. */
  thumbnailUrl: string | null;
}

export interface CreatorProfilePost {
  id: string;
  title: string | null;
  description: string | null;
  createdAt: string;
  media: ProfilePostMediaItem[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  /** is_buy !== 1 — viewer has no access to this post's content. */
  locked: boolean;
}
