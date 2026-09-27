import { formatCount } from "@/lib/formatter/count";
import type { AnalyticsSummary } from "@/features/creator-analytics/types/creator-analytics.types";

interface AnalyticsContentStatsCardProps {
  summary: AnalyticsSummary;
  truncated: boolean;
}

export function AnalyticsContentStatsCard({ summary, truncated }: AnalyticsContentStatsCardProps) {
  const tiles = [
    { key: "posts", label: "Total posts", value: formatCount(summary.totalPosts) },
    { key: "avg-views", label: "Avg views / post", value: formatCount(summary.avgViewsPerPost) },
    { key: "avg-likes", label: "Avg likes / post", value: formatCount(summary.avgLikesPerPost) },
    { key: "avg-comments", label: "Avg comments / post", value: formatCount(summary.avgCommentsPerPost) },
  ];

  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-4.5">
      <div className="mb-3">
        <div className="font-display text-base font-semibold text-text-primary">Content performance</div>
        <div className="mt-0.5 font-sans text-[11.5px] font-light text-text-secondary/70">
          Lifetime totals across your posts{truncated ? " (most recent posts loaded)" : ""}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.key} className="rounded-lg border border-primary/10 bg-surface-elevated/40 px-3 py-2.5">
            <div className="font-display text-lg font-semibold text-text-primary">{tile.value}</div>
            <div className="font-sans text-[10.5px] font-light text-text-secondary/70">{tile.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
