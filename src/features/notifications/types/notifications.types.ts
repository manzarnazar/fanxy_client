export type NotificationGroupKey = "today" | "yesterday" | "week" | "month";

export interface NotificationItem {
  id: string;
  actorId: string;
  actorName: string;
  actorAvatarUrl: string | null;
  title: string | null;
  message: string;
  createdAt: string;
  timeLabel: string;
  groupKey: NotificationGroupKey;
  postId: string | null;
  postTitle: string | null;
  postImageUrl: string | null;
}

export interface NotificationGroup {
  key: NotificationGroupKey;
  label: string;
  items: NotificationItem[];
}
