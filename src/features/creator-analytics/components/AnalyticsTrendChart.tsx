import { cn } from "@/lib/utils/cn";
import type { TrendPoint } from "@/features/creator-analytics/types/creator-analytics.types";

interface AnalyticsTrendChartProps {
  points: TrendPoint[];
  /** Sets currentColor for the stroke/fill (e.g. "text-primary-light"). */
  colorClassName: string;
  valuePrefix?: string;
}

// Lightweight inline-SVG area chart — the design's charts are inline SVG too,
// and the data is small (6–12 buckets), so no chart library is needed.
export function AnalyticsTrendChart({ points, colorClassName, valuePrefix = "" }: AnalyticsTrendChartProps) {
  if (points.length < 2) return null;

  const max = Math.max(...points.map((point) => point.value), 1);
  const coords = points.map((point, index) => ({
    x: (index / (points.length - 1)) * 100,
    y: 38 - (point.value / max) * 32,
  }));
  const line = coords.map((coord) => `${coord.x},${coord.y}`).join(" ");
  const area = `0,40 ${line} 100,40`;

  return (
    <div className={cn("w-full", colorClassName)}>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-36 w-full" role="img" aria-label="Trend chart">
        <polygon points={area} fill="currentColor" opacity="0.14" />
        <polyline points={line} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
        {coords.map((coord, index) => (
          <circle key={points[index].label + index} cx={coord.x} cy={coord.y} r="1.6" fill="currentColor">
            <title>{`${points[index].label}: ${valuePrefix}${points[index].value.toLocaleString()}`}</title>
          </circle>
        ))}
      </svg>
      <div className="mt-1.5 flex justify-between">
        {points.map((point, index) => (
          <span
            key={point.label + index}
            className={cn(
              "font-sans text-[10px] font-light text-text-secondary/60",
              points.length > 8 && index % 2 === 1 && "hidden sm:inline",
            )}
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}
