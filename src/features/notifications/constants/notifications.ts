import type { NotificationGroupKey } from "@/features/notifications/types/notifications.types";

export interface NotificationGroupDef {
  key: NotificationGroupKey;
  label: string;
}

export const NOTIFICATION_GROUP_DEFS: NotificationGroupDef[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "week", label: "This week" },
  { key: "month", label: "Earlier this month" },
];
