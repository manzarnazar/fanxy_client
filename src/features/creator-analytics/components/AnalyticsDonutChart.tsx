import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { donutColorClassName } from "@/features/creator-analytics/constants/creator-analytics";
import type { PackageRevenueSlice } from "@/features/creator-analytics/types/creator-analytics.types";

interface AnalyticsDonutChartProps {
  slices: PackageRevenueSlice[];
}

// r = 15.9155 gives a circumference of ~100, so stroke-dasharray works in
// plain percentage units.
const RADIUS = 15.9155;

export function AnalyticsDonutChart({ slices }: AnalyticsDonutChartProps) {
  const total = slices.reduce((sum, slice) => sum + slice.totalRevenue, 0);

  // Each segment starts where the previous one ended; 25 puts the first
  // segment's start at 12 o'clock.
  const segments = slices.reduce<Array<{ slice: PackageRevenueSlice; percent: number; offset: number }>>(
    (accumulated, slice) => {
      const percent = total > 0 ? (slice.totalRevenue / total) * 100 : 0;
      const previous = accumulated[accumulated.length - 1];
      const offset = previous ? previous.offset - previous.percent : 25;
      return [...accumulated, { slice, percent, offset }];
    },
    [],
  );

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-0">
          <circle cx="18" cy="18" r={RADIUS} fill="none" strokeWidth="4" className="stroke-text-secondary/10" />
          {segments.map(({ slice, percent, offset }, index) => (
            <circle
              key={slice.packageName}
              cx="18"
              cy="18"
              r={RADIUS}
              fill="none"
              strokeWidth="4"
              stroke="currentColor"
              strokeDasharray={`${percent} ${100 - percent}`}
              strokeDashoffset={offset}
              className={donutColorClassName(index)}
            >
              <title>{`${slice.packageName}: $${slice.totalRevenue.toLocaleString()}`}</title>
            </circle>
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg font-semibold text-text-primary">${formatCount(total)}</span>
          <span className="font-sans text-[10px] font-light text-text-secondary/60">Total</span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {slices.map((slice, index) => (
          <div key={slice.packageName} className="flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full bg-current", donutColorClassName(index))} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate font-sans text-[12px] font-medium text-text-primary">{slice.packageName}</span>
            <span className="shrink-0 font-sans text-[11.5px] font-light text-text-secondary/65">
              ${formatCount(slice.totalRevenue)} · {slice.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
