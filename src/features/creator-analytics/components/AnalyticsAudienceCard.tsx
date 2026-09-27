import { formatCount } from "@/lib/formatter/count";
import { AnalyticsTrendChart } from "@/features/creator-analytics/components/AnalyticsTrendChart";
import type { AnalyticsSummary, TrendPoint } from "@/features/creator-analytics/types/creator-analytics.types";

interface AnalyticsAudienceCardProps {
  summary: AnalyticsSummary;
  trend: TrendPoint[];
}

export function AnalyticsAudienceCard({ summary, trend }: AnalyticsAudienceCardProps) {
  const tiles = [
    { key: "new", label: "New subscribers", value: formatCount(summary.newSubscribers), valueClassName: "text-success" },
    { key: "renewals", label: "Renewals", value: formatCount(summary.renewals), valueClassName: "text-primary-light" },
    { key: "active", label: "Active", value: formatCount(summary.activeSubscribers), valueClassName: "text-text-primary" },
    { key: "expired", label: "Expired", value: formatCount(summary.expiredSubscribers), valueClassName: "text-danger" },
  ];

  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-4.5">
      <div className="mb-3">
        <div className="font-display text-base font-semibold text-text-primary">Subscribers</div>
        <div className="mt-0.5 font-sans text-[11.5px] font-light text-text-secondary/70">
          First-time buyers in the selected range
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.key} className="rounded-lg border border-primary/10 bg-surface-elevated/40 px-3 py-2.5">
            <div className={`font-display text-lg font-semibold ${tile.valueClassName}`}>{tile.value}</div>
            <div className="font-sans text-[10.5px] font-light text-text-secondary/70">{tile.label}</div>
          </div>
        ))}
      </div>

      <AnalyticsTrendChart points={trend} colorClassName="text-success" />
    </div>
  );
}
