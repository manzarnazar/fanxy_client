import { formatRelativeTime } from "@/lib/formatter/relativeTime";
import { sanitizeMediaUrl } from "@/lib/utils/media-url";
import type { ApiPostResult } from "@/types/api/post.types";
import type { ApiStoryItem } from "@/types/api/story.types";
import type { ContentItem } from "@/features/my-content/types/my-content.types";

function formatScheduleLabel(scheduleDate: string | null, scheduleTime: string | null): string {
  if (!scheduleDate) return "Scheduled";
  return scheduleTime ? `Scheduled · ${scheduleDate} ${scheduleTime}` : `Scheduled · ${scheduleDate}`;
}

export function mapPostToContentItem(post: ApiPostResult, now: Date = new Date()): ContentItem {
  const content = post.post_content[0];
  const mediaType: ContentItem["mediaType"] = content?.content_type === 2 ? "video" : "image";
  const scheduled = post.is_schedule === 1;

  return {
    id: String(post.id),
    kind: "post",
    mediaType,
    mediaUrl: sanitizeMediaUrl(mediaType === "video" ? content?.video : content?.image),
    thumbnailUrl: sanitizeMediaUrl(content?.image),
    title: post.title,
    description: post.description,
    createdAt: post.created_at,
    dateLabel: scheduled ? formatScheduleLabel(post.schedule_date, post.schedule_time) : formatRelativeTime(post.created_at, now),
    scheduled,
    scheduleLabel: scheduled ? formatScheduleLabel(post.schedule_date, post.schedule_time) : null,
    viewCount: post.total_view,
    likeCount: post.total_like,
    commentCount: post.total_comment,
  };
}

export function mapStoryToContentItem(story: ApiStoryItem, now: Date = new Date()): ContentItem {
  return {
    id: String(story.id),
    kind: "story",
    mediaType: story.type === "video" ? "video" : "image",
    mediaUrl: sanitizeMediaUrl(story.url),
    thumbnailUrl: sanitizeMediaUrl(story.url),
    title: null,
    description: story.description,
    createdAt: story.created_at,
    dateLabel: formatRelativeTime(story.created_at, now),
    scheduled: false,
    scheduleLabel: null,
    viewCount: story.total_view,
    likeCount: null,
    commentCount: null,
  };
}
