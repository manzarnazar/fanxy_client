import { Grid3x3, Rows3, type LucideIcon } from "lucide-react";
import type { PackagePeriod, PackagesPeriodFilter, PackagesSort, PackagesViewMode } from "@/features/packages/types/packages.types";

export const PACKAGE_PERIODS: PackagePeriod[] = ["Day", "Week", "Month", "Year"];

export interface PeriodFilterDef {
  key: PackagesPeriodFilter;
  label: string;
}

export const PERIOD_FILTERS: PeriodFilterDef[] = [
  { key: "all", label: "All" },
  { key: "Day", label: "Daily" },
  { key: "Week", label: "Weekly" },
  { key: "Month", label: "Monthly" },
  { key: "Year", label: "Yearly" },
];

export interface SortOptionDef {
  key: PackagesSort;
  label: string;
}

export const SORT_OPTIONS: SortOptionDef[] = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "price_desc", label: "Highest price" },
  { key: "price_asc", label: "Lowest price" },
  { key: "alphabetical", label: "Alphabetical" },
];

export interface ViewModeDef {
  key: PackagesViewMode;
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

export function packageColorClassName(packageId: string): string {
  let hash = 0;
  for (let i = 0; i < packageId.length; i += 1) hash = (hash * 31 + packageId.charCodeAt(i)) % PACKAGE_COLOR_CLASSNAMES.length;
  return PACKAGE_COLOR_CLASSNAMES[hash];
}
