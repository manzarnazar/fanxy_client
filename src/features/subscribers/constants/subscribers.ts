import { Grid3x3, Rows3, type LucideIcon } from "lucide-react";
import type { SubscribersSort, SubscribersStatusFilter, SubscribersViewMode } from "@/features/subscribers/types/subscribers.types";

export interface StatusFilterDef {
  key: SubscribersStatusFilter;
  label: string;
}

export const STATUS_FILTERS: StatusFilterDef[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "expired", label: "Expired" },
];

export interface SortOptionDef {
  key: SubscribersSort;
  label: string;
}

export const SORT_OPTIONS: SortOptionDef[] = [
  { key: "recent", label: "Most recent" },
  { key: "revenue", label: "Highest revenue" },
  { key: "alphabetical", label: "Alphabetical" },
  { key: "longest", label: "Longest subscriber" },
];

export interface ViewModeDef {
  key: SubscribersViewMode;
  label: string;
  icon: LucideIcon;
}

export const VIEW_MODES: ViewModeDef[] = [
  { key: "grid", label: "Grid", icon: Grid3x3 },
  { key: "list", label: "List", icon: Rows3 },
];

const PACKAGE_COLOR_CLASSNAMES = [
  "bg-gradient-to-br from-primary-light to-primary text-[#03283a]",
  "bg-gradient-to-br from-secondary-light to-secondary-dark text-white",
  "bg-gradient-to-br from-accent-gold-light to-accent-gold text-[#1e1502]",
  "bg-gradient-to-br from-accent-purple-light to-accent-purple text-[#1e1240]",
];

export function packageColorClassName(packageName: string | null): string {
  const key = packageName ?? "Other";
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) % PACKAGE_COLOR_CLASSNAMES.length;
  return PACKAGE_COLOR_CLASSNAMES[hash];
}
