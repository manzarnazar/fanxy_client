import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CreatorDashboardHeaderBarProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export function CreatorDashboardHeaderBar({ onRefresh, refreshing }: CreatorDashboardHeaderBarProps) {
  return (
    <div className="mb-4.5 flex items-center justify-between">
      <h1 className="font-display text-[26px] leading-none font-semibold text-text-primary">Creator Dashboard</h1>

      <button
        type="button"
        onClick={onRefresh}
        aria-label="Refresh dashboard"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/12"
      >
        <RefreshCw className={cn("h-[18px] w-[18px]", refreshing && "animate-spin")} aria-hidden="true" />
      </button>
    </div>
  );
}
