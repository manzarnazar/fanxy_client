import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SubscribersHeaderBarProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export function SubscribersHeaderBar({ onRefresh, refreshing }: SubscribersHeaderBarProps) {
  return (
    <div className="mb-4.5 flex items-center gap-3.5">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-[26px] leading-none font-semibold text-text-primary">My Subscribers</h1>
        <p className="mt-1 font-sans text-[12.5px] font-light text-text-secondary/70">
          Everyone subscribed to your packages, in one place.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        aria-label="Refresh subscribers"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/12"
      >
        {refreshing ? (
          <Loader2 className={cn("h-[18px] w-[18px] animate-spin")} aria-hidden="true" />
        ) : (
          <RefreshCw className="h-[18px] w-[18px]" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
