export type ContentKind = "post" | "story";
export type ContentMediaType = "image" | "video";
export type ContentTab = "post" | "story";
export type PostStatusFilter = "all" | "published" | "scheduled";
export type ContentViewMode = "grid" | "list" | "compact";

export interface ContentItem {
  id: string;
  kind: ContentKind;
  mediaType: ContentMediaType;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  title: string | null;
  description: string | null;
  createdAt: string;
  dateLabel: string;
  scheduled: boolean;
  scheduleLabel: string | null;
  viewCount: number;
  likeCount: number | null;
  commentCount: number | null;
}

export interface UploadPostInput {
  title: string;
  description: string;
  /** One or more media items — a post can carry multiple post_content entries. */
  mediaFiles: File[];
  /** Picker hint for the modal UI; per-file type is derived from file.type. */
  mediaType: ContentMediaType;
  isCommentEnabled: boolean;
  isScheduled: boolean;
  scheduleDate: string;
  scheduleTime: string;
}
