import { cn } from "@/lib/utils/cn";
import { PERIOD_FILTERS } from "@/features/packages/constants/packages";
import type { PackagesPeriodFilter } from "@/features/packages/types/packages.types";

interface PackagesFilterChipsProps {
  activeFilter: PackagesPeriodFilter;
  onSelect: (filter: PackagesPeriodFilter) => void;
}

export function PackagesFilterChips({ activeFilter, onSelect }: PackagesFilterChipsProps) {
  return (
    <div className="mb-3.5 flex gap-1.5">
      {PERIOD_FILTERS.map((filter) => {
        const isActive = activeFilter === filter.key;
        return (
          <button
            key={filter.key}
            type="button"
            onClick={() => onSelect(filter.key)}
            className={cn(
              "flex shrink-0 items-center rounded-full border px-3.5 py-2 font-sans text-[12.5px] font-medium whitespace-nowrap transition",
              isActive
                ? "border-transparent bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
                : "border-primary/18 bg-surface/60 text-text-secondary/85 hover:bg-primary/10",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
