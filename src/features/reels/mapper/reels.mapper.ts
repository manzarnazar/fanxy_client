import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiPostListResponse, ApiPostResult } from "@/types/api/post.types";
import type { Reel } from "@/features/reels/types/reels.types";

export function mapApiReel(post: ApiPostResult): Reel | null {
  const videoContent = post.post_content.find((content) => content.content_type === 2 && content.video);
  const videoUrl = sanitizeMediaUrl(videoContent?.video);
  if (!videoUrl) return null;

  return {
    id: String(post.id),
    creatorId: String(post.user_id),
    creatorName: post.user_name,
    creatorFullName: post.full_name,
    creatorAvatarUrl: sanitizeMediaUrl(post.profile_img),
    isCreator: post.is_creator === 1,
    createdAt: post.created_at,
    title: post.title,
    description: post.description,
    videoUrl,
    viewCount: post.total_view,
    likeCount: post.total_like,
    commentCount: post.total_comment,
    likedByMe: post.is_like === 1,
    // is_buy = 1 means the viewer HAS access (bought/subscribed); 0 = locked.
    locked: post.is_buy !== 1,
    commentsEnabled: post.is_comment === 1,
    followedByMe: false,
    subscribedByMe: false,
  };
}

export function mapApiReelsResponse(response: ApiPostListResponse): { reels: Reel[]; page: number; hasMore: boolean } {
  return {
    reels: response.result.map(mapApiReel).filter((reel): reel is Reel => reel !== null),
    page: response.current_page,
    hasMore: response.more_page,
  };
}
