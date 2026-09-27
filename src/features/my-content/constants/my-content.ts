import { Grid3x3, Image as ImageIcon, Layers, Rows3, Sparkles, type LucideIcon } from "lucide-react";
import type { ContentTab, ContentViewMode, PostStatusFilter } from "@/features/my-content/types/my-content.types";

export interface ContentTabDef {
  key: ContentTab;
  label: string;
  icon: LucideIcon;
}

export const CONTENT_TABS: ContentTabDef[] = [
  { key: "post", label: "Posts", icon: ImageIcon },
  { key: "story", label: "Stories", icon: Sparkles },
];

export interface PostStatusFilterDef {
  key: PostStatusFilter;
  label: string;
}

export const POST_STATUS_FILTERS: PostStatusFilterDef[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "scheduled", label: "Scheduled" },
];

export interface ContentViewModeDef {
  key: ContentViewMode;
  label: string;
  icon: LucideIcon;
}

export const CONTENT_VIEW_MODES: ContentViewModeDef[] = [
  { key: "grid", label: "Grid", icon: Grid3x3 },
  { key: "list", label: "List", icon: Rows3 },
  { key: "compact", label: "Compact", icon: Layers },
];
