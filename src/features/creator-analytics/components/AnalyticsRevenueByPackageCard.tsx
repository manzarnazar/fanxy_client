import { PackageOpen } from "lucide-react";
import { AnalyticsDonutChart } from "@/features/creator-analytics/components/AnalyticsDonutChart";
import type { PackageRevenueSlice } from "@/features/creator-analytics/types/creator-analytics.types";

interface AnalyticsRevenueByPackageCardProps {
  slices: PackageRevenueSlice[];
}

export function AnalyticsRevenueByPackageCard({ slices }: AnalyticsRevenueByPackageCardProps) {
  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-4.5">
      <div className="mb-3.5 font-display text-base font-semibold text-text-primary">Revenue by package</div>

      {slices.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <PackageOpen className="h-8 w-8 text-text-secondary/40" aria-hidden="true" />
          <p className="font-sans text-[12px] font-light text-text-secondary/70">No package sales in this range yet.</p>
        </div>
      ) : (
        <AnalyticsDonutChart slices={slices} />
      )}
    </div>
  );
}
