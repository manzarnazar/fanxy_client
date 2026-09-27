import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiLiveUserResult, ApiStoryGroup } from "@/types/api/home.types";
import type { ApiPostContent, ApiPostResult } from "@/types/api/post.types";
import type { LiveCreator, Post, PostMediaItem, StoryGroup } from "@/features/home/types/home.types";

function mapPostContent(content: ApiPostContent): PostMediaItem {
  const isVideo = content.content_type === 2;
  return {
    id: String(content.id),
    type: isVideo ? "video" : "image",
    url: sanitizeMediaUrl(isVideo ? content.video : content.image),
    thumbnailUrl: sanitizeMediaUrl(content.image),
  };
}

export function mapApiPost(post: ApiPostResult): Post {
  return {
    id: String(post.id),
    creatorId: String(post.user_id),
    creatorName: post.user_name,
    creatorFullName: post.full_name,
    creatorAvatarUrl: sanitizeMediaUrl(post.profile_img),
    isCreator: post.is_creator === 1,
    isPrivate: post.is_private === 1,
    createdAt: post.created_at,
    title: post.title,
    description: post.description,
    media: post.post_content.map(mapPostContent),
    commentsEnabled: post.is_comment === 1,
    viewCount: post.total_view,
    likeCount: post.total_like,
    commentCount: post.total_comment,
    likedByMe: post.is_like === 1,
    // is_buy = 1 means the viewer HAS access (bought/subscribed); 0 = locked.
    locked: post.is_buy !== 1,
    scheduled: post.is_schedule === 1,
    scheduleDate: post.schedule_date,
    scheduleTime: post.schedule_time,
  };
}

export function mapApiStoryGroup(group: ApiStoryGroup): StoryGroup {
  return {
    creatorId: String(group.user_id),
    // The backend bakes the "@" prefix into user_name — strip it so
    // /stories/[username] URLs and matching stay clean.
    creatorName: group.user_name.replace(/^@+/, ""),
    creatorFullName: group.full_name,
    avatarUrl: sanitizeMediaUrl(group.user_image),
    items: group.story.flatMap((item) => {
      // Drop stories whose media path is corrupted server-side.
      const url = sanitizeMediaUrl(item.url);
      if (!url) return [];
      return [
        {
          id: String(item.id),
          type: item.type === "video" ? ("video" as const) : ("image" as const),
          url,
          description: item.description,
          viewed: item.is_view === 1,
        },
      ];
    }),
  };
}

export function mapApiLiveUser(user: ApiLiveUserResult): LiveCreator {
  return {
    id: String(user.user_id),
    streamId: String(user.id),
    roomId: user.room_id,
    name: user.user_name,
    fullName: user.full_name,
    avatarUrl: sanitizeMediaUrl(user.image),
    viewerCount: user.total_view,
    canView: user.can_view_live_stream === 1,
  };
}
