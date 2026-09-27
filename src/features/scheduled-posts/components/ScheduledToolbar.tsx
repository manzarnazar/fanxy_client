import { CalendarDays, List } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  SCHEDULED_RANGE_FILTERS,
  SCHEDULED_TYPE_FILTERS,
  SCHEDULED_VIEW_MODES,
} from "@/features/scheduled-posts/constants/scheduled-posts";
import type {
  ScheduledRangeFilter,
  ScheduledTypeFilter,
  ScheduledViewMode,
} from "@/features/scheduled-posts/types/scheduled-posts.types";

const VIEW_ICONS = { calendar: CalendarDays, list: List };

interface ScheduledToolbarProps {
  viewMode: ScheduledViewMode;
  onViewModeChange: (mode: ScheduledViewMode) => void;
  typeFilter: ScheduledTypeFilter;
  onTypeFilterChange: (filter: ScheduledTypeFilter) => void;
  rangeFilter: ScheduledRangeFilter;
  onRangeFilterChange: (filter: ScheduledRangeFilter) => void;
}

export function ScheduledToolbar({
  viewMode,
  onViewModeChange,
  typeFilter,
  onTypeFilterChange,
  rangeFilter,
  onRangeFilterChange,
}: ScheduledToolbarProps) {
  return (
    <div className="mb-4.5 flex flex-wrap items-center gap-2.5">
      <div className="flex gap-1.5 overflow-x-auto">
        {SCHEDULED_RANGE_FILTERS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onRangeFilterChange(option.key)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 font-sans text-[12px] font-medium whitespace-nowrap transition",
              rangeFilter === option.key
                ? "bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
                : "border border-primary/16 bg-surface/60 text-text-secondary hover:bg-primary/10",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <span className="hidden h-5 w-px bg-primary/14 sm:block" />

      <div className="flex gap-1.5">
        {SCHEDULED_TYPE_FILTERS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onTypeFilterChange(option.key)}
            className={cn(
              "rounded-full px-3 py-1.5 font-sans text-[12px] font-medium transition",
              typeFilter === option.key
                ? "border border-primary/32 bg-primary/14 text-primary-light"
                : "border border-primary/16 bg-surface/60 text-text-secondary hover:bg-primary/10",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex rounded-md border border-primary/16 bg-surface/60 p-0.5">
        {SCHEDULED_VIEW_MODES.map((mode) => {
          const Icon = VIEW_ICONS[mode.key];
          return (
            <button
              key={mode.key}
              type="button"
              title={mode.label}
              aria-pressed={viewMode === mode.key}
              onClick={() => onViewModeChange(mode.key)}
              className={cn(
                "flex h-8 w-9 items-center justify-center rounded-[5px] transition",
                viewMode === mode.key ? "bg-primary/16 text-primary-light" : "text-text-secondary hover:text-text-primary",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
