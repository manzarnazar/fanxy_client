import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NotificationsHeaderBarProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export function NotificationsHeaderBar({ onRefresh, refreshing }: NotificationsHeaderBarProps) {
  return (
    <div className="mb-4.5 flex items-center gap-3.5">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-[30px] leading-none font-semibold text-text-primary">Notifications</h1>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        aria-label="Refresh notifications"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/12"
      >
        <RefreshCw className={cn("h-[18px] w-[18px]", refreshing && "animate-spin")} aria-hidden="true" />
      </button>
    </div>
  );
}
