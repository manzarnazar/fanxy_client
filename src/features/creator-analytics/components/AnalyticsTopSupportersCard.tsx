import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import type { AnalyticsTopFan } from "@/features/creator-analytics/types/creator-analytics.types";

const RANK_COLOR_CLASSNAMES = ["text-accent-gold-light", "text-[#cfeaf8]", "text-[#e0a06a]"];

interface AnalyticsTopSupportersCardProps {
  topFans: AnalyticsTopFan[];
}

export function AnalyticsTopSupportersCard({ topFans }: AnalyticsTopSupportersCardProps) {
  if (topFans.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-4.5">
      <div className="mb-3.5 font-display text-base font-semibold text-text-primary">Top supporters</div>
      <div className="flex flex-col gap-3">
        {topFans.slice(0, 5).map((fan, index) => (
          <div key={fan.userId} className="flex items-center gap-2.5">
            <span
              className={cn(
                "w-4 shrink-0 font-display text-sm font-semibold",
                RANK_COLOR_CLASSNAMES[index] ?? "text-text-secondary/50",
              )}
            >
              {index + 1}
            </span>
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-surface-elevated">
              {fan.avatarUrl ? (
                <Image src={fan.avatarUrl} alt="" fill sizes="36px" className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-text-secondary/40">
                  <User className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-sans text-[12.5px] font-medium text-text-primary">{fan.name}</div>
            </div>
            <span className="shrink-0 font-sans text-[12px] font-semibold text-success">${formatCount(fan.totalSpend)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
