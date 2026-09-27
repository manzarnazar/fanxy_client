import { cn } from "@/lib/utils/cn";
import { ANALYTICS_RANGES } from "@/features/creator-analytics/constants/creator-analytics";
import type { AnalyticsRangeKey } from "@/features/creator-analytics/types/creator-analytics.types";

interface AnalyticsRangePillsProps {
  range: AnalyticsRangeKey;
  onChange: (range: AnalyticsRangeKey) => void;
}

export function AnalyticsRangePills({ range, onChange }: AnalyticsRangePillsProps) {
  return (
    <div className="mb-4.5 flex flex-wrap gap-2" role="tablist" aria-label="Date range">
      {ANALYTICS_RANGES.map((option) => {
        const isActive = option.key === range;
        return (
          <button
            key={option.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 font-sans text-[12px] font-medium transition",
              isActive
                ? "bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
                : "border border-primary/16 bg-surface/60 text-text-secondary hover:bg-primary/10 hover:text-text-primary",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
