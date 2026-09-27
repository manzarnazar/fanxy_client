import { formatCount } from "@/lib/formatter/count";
import { AnalyticsTrendChart } from "@/features/creator-analytics/components/AnalyticsTrendChart";
import type { TrendPoint } from "@/features/creator-analytics/types/creator-analytics.types";

interface AnalyticsEarningsCardProps {
  totalRevenue: number;
  trend: TrendPoint[];
  truncated: boolean;
}

export function AnalyticsEarningsCard({ totalRevenue, trend, truncated }: AnalyticsEarningsCardProps) {
  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-4.5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <div className="font-display text-base font-semibold text-text-primary">Revenue over time</div>
          <div className="mt-0.5 font-sans text-[11.5px] font-light text-text-secondary/70">
            Package purchases in the selected range
          </div>
        </div>
        <span className="font-display text-2xl font-semibold text-text-primary">${formatCount(totalRevenue)}</span>
      </div>

      <AnalyticsTrendChart points={trend} colorClassName="text-primary-light" valuePrefix="$" />

      {truncated && (
        <p className="mt-3 font-sans text-[11px] font-light text-text-secondary/60">
          Showing the most recent transactions — older history beyond the loaded pages isn&apos;t included.
        </p>
      )}
    </div>
  );
}
