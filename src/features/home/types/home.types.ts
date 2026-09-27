export type PostMediaType = "image" | "video";

export interface PostMediaItem {
  id: string;
  type: PostMediaType;
  /** Playable source: the video file for type "video", the image file for type "image". */
  url: string | null;
  /** Poster/cover image — present for both image and video content items. */
  thumbnailUrl: string | null;
}

export interface Post {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorFullName: string;
  creatorAvatarUrl: string | null;
  isCreator: boolean;
  isPrivate: boolean;
  createdAt: string;
  title: string | null;
  description: string | null;
  media: PostMediaItem[];
  commentsEnabled: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  locked: boolean;
  scheduled: boolean;
  scheduleDate: string | null;
  scheduleTime: string | null;
}

export interface StoryItem {
  id: string;
  type: "image" | "video";
  url: string;
  description: string | null;
  viewed: boolean;
}

export interface StoryGroup {
  creatorId: string;
  creatorName: string;
  creatorFullName: string;
  avatarUrl: string | null;
  items: StoryItem[];
}

export interface LiveCreator {
  id: string;
  streamId: string;
  roomId: string;
  name: string;
  fullName: string;
  avatarUrl: string | null;
  viewerCount: number;
  canView: boolean;
}
