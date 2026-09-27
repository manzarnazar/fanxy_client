import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiProfileResult } from "@/types/api/creator-profile.types";
import type { ApiPostContent, ApiPostResult } from "@/types/api/post.types";
import type {
  CreatorProfile,
  CreatorProfilePost,
  CreatorSocialLink,
  ProfilePostMediaItem,
} from "@/features/creator-profile/types/creator-profile.types";

function buildSocialLinks(row: ApiProfileResult): CreatorSocialLink[] {
  const entries: Array<{ platform: CreatorSocialLink["platform"]; url: string | null }> = [
    { platform: "instagram", url: row.instagram_url },
    { platform: "facebook", url: row.facebook_url },
    { platform: "youtube", url: row.youtube_url },
    { platform: "x", url: row.twitter_url },
  ];
  return entries
    .filter((entry): entry is { platform: CreatorSocialLink["platform"]; url: string } =>
      Boolean(entry.url && entry.url.trim()),
    )
    .map((entry) => ({ platform: entry.platform, url: entry.url }));
}

export function mapApiCreatorProfile(row: ApiProfileResult): CreatorProfile {
  // The backend bakes an "@" prefix into user_name — strip it everywhere.
  const username = row.user_name.replace(/^@+/, "");
  return {
    id: String(row.id),
    firebaseId: row.firebase_id,
    username,
    name: row.full_name || username,
    avatarUrl: sanitizeMediaUrl(row.image),
    coverUrl: sanitizeMediaUrl(row.cover_img),
    bio: row.bio?.trim() ? row.bio.trim() : null,
    countryName: row.country_name?.trim() ? row.country_name.trim() : null,
    isCreator: row.is_creator === 1,
    verified: row.is_verified_at === 1,
    isPrivate: row.is_private === 1,
    subscribed: row.is_buy === 1,
    canChat: row.can_chat === 1,
    canViewLiveStream: row.can_view_live_stream === 1,
    blocked: row.is_block === 1,
    memberSince: row.created_at,
    socialLinks: buildSocialLinks(row),
  };
}

function mapPostContent(content: ApiPostContent): ProfilePostMediaItem {
  const isVideo = content.content_type === 2;
  return {
    id: String(content.id),
    type: isVideo ? "video" : "image",
    url: sanitizeMediaUrl(isVideo ? content.video : content.image),
    thumbnailUrl: sanitizeMediaUrl(content.image),
  };
}

export function mapApiCreatorProfilePost(post: ApiPostResult): CreatorProfilePost {
  return {
    id: String(post.id),
    title: post.title?.trim() ? post.title.trim() : null,
    description: post.description?.trim() ? post.description.trim() : null,
    createdAt: post.created_at,
    media: post.post_content.map(mapPostContent),
    viewCount: post.total_view,
    likeCount: post.total_like,
    commentCount: post.total_comment,
    locked: post.is_buy !== 1,
  };
}
