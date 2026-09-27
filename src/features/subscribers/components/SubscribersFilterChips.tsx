import { cn } from "@/lib/utils/cn";
import { STATUS_FILTERS } from "@/features/subscribers/constants/subscribers";
import type { SubscribersStatusFilter } from "@/features/subscribers/types/subscribers.types";

interface SubscribersFilterChipsProps {
  activeFilter: SubscribersStatusFilter;
  onSelect: (filter: SubscribersStatusFilter) => void;
  activeCount: number;
  expiredCount: number;
}

export function SubscribersFilterChips({ activeFilter, onSelect, activeCount, expiredCount }: SubscribersFilterChipsProps) {
  const countFor = (key: SubscribersStatusFilter) => (key === "active" ? activeCount : key === "expired" ? expiredCount : null);

  return (
    <div className="mb-3.5 flex gap-1.5">
      {STATUS_FILTERS.map((filter) => {
        const isActive = activeFilter === filter.key;
        const count = countFor(filter.key);
        return (
          <button
            key={filter.key}
            type="button"
            onClick={() => onSelect(filter.key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 font-sans text-[12.5px] font-medium whitespace-nowrap transition",
              isActive
                ? "border-transparent bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
                : "border-primary/18 bg-surface/60 text-text-secondary/85 hover:bg-primary/10",
            )}
          >
            {filter.label}
            {count !== null && (
              <span className={cn("rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold", isActive ? "bg-[#03283a]/20 text-[#03283a]" : "bg-primary/16 text-primary-light")}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
