export type PackagePeriod = "Day" | "Week" | "Month" | "Year";
export type PackagesSort = "newest" | "oldest" | "price_asc" | "price_desc" | "alphabetical";
export type PackagesViewMode = "grid" | "list";
export type PackagesPeriodFilter = "all" | PackagePeriod;

export interface CreatorPackage {
  id: string;
  name: string;
  price: number;
  period: PackagePeriod;
  periodCount: number;
  billingLabel: string;
  imageUrl: string | null;
  createdAt: string;
  createdLabel: string;
}

export interface PackageFormInput {
  name: string;
  price: string;
  period: PackagePeriod;
  periodCount: string;
  canChat: boolean;
  canViewLiveStream: boolean;
}
