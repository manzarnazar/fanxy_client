import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { packageColorClassName } from "@/features/subscribers/constants/subscribers";
import type { PackageRevenueBreakdown } from "@/features/subscribers/types/subscribers.types";

interface SubscribersRevenueByPackageWidgetProps {
  breakdown: PackageRevenueBreakdown[];
}

export function SubscribersRevenueByPackageWidget({ breakdown }: SubscribersRevenueByPackageWidgetProps) {
  if (breakdown.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-4">
      <div className="mb-3.5 font-display text-base font-semibold text-text-primary">Revenue by package</div>
      <div className="flex flex-col gap-3.5">
        {breakdown.map((item) => (
          <div key={item.packageName}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="truncate font-sans text-[12px] font-medium text-text-primary">{item.packageName}</span>
              <span className="shrink-0 font-sans text-[11.5px] font-light text-text-secondary/65">${formatCount(item.totalRevenue)}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-text-secondary/10">
              <div className={cn("h-full rounded-full", packageColorClassName(item.packageName))} style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
