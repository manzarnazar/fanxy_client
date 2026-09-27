import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AnalyticsHeaderBarProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export function AnalyticsHeaderBar({ refreshing, onRefresh }: AnalyticsHeaderBarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <span className="mb-1.5 inline-block rounded-full border border-primary/22 bg-primary/10 px-3 py-0.5 font-sans text-[10.5px] font-medium tracking-wide text-primary-light">
          Analytics
        </span>
        <h1 className="font-display text-[26px] leading-tight font-semibold text-text-primary">Creator Analytics</h1>
        <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
          Understand your audience, revenue and creator growth.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="flex items-center gap-1.5 rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2 font-sans text-[12.5px] font-medium text-text-secondary transition hover:bg-primary/12 hover:text-text-primary disabled:opacity-60"
      >
        <RefreshCw className={cn("h-[15px] w-[15px]", refreshing && "animate-spin")} aria-hidden="true" />
        Refresh
      </button>
    </div>
  );
}
