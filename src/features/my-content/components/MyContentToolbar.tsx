import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CONTENT_VIEW_MODES, POST_STATUS_FILTERS } from "@/features/my-content/constants/my-content";
import type { ContentTab, ContentViewMode, PostStatusFilter } from "@/features/my-content/types/my-content.types";

interface MyContentToolbarProps {
  tab: ContentTab;
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: PostStatusFilter;
  onStatusFilterChange: (status: PostStatusFilter) => void;
  viewMode: ContentViewMode;
  onViewModeChange: (mode: ContentViewMode) => void;
  resultCount: number;
}

export function MyContentToolbar({
  tab,
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  resultCount,
}: MyContentToolbarProps) {
  return (
    <div className="mb-3.5 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex h-10.5 min-w-0 flex-1 items-center gap-2.5 rounded-md border border-primary/16 bg-surface/60 px-3.5">
          <Search className="h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by title or description…"
            aria-label="Search content"
            className="w-full bg-transparent font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
          />
          {query && (
            <button type="button" onClick={() => onQueryChange("")} aria-label="Clear search" className="shrink-0 text-text-secondary/50 hover:text-text-primary">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex h-10.5 shrink-0 items-center gap-0.5 rounded-md border border-primary/16 bg-surface/60 p-1">
          {CONTENT_VIEW_MODES.map((mode) => {
            const isActive = viewMode === mode.key;
            return (
              <button
                key={mode.key}
                type="button"
                onClick={() => onViewModeChange(mode.key)}
                aria-label={mode.label}
                aria-pressed={isActive}
                className={cn("flex h-8.5 w-8.5 items-center justify-center rounded-md transition", isActive ? "bg-primary/16 text-primary-light" : "text-text-secondary/55 hover:text-text-primary")}
              >
                <mode.icon className="h-4 w-4" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {tab === "post" && (
          <div className="flex gap-1.5">
            {POST_STATUS_FILTERS.map((filter) => {
              const isActive = statusFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => onStatusFilterChange(filter.key)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 font-sans text-[11.5px] font-medium transition",
                    isActive ? "border-primary/40 bg-primary/12 text-primary-light" : "border-primary/16 bg-surface/60 text-text-secondary/80 hover:bg-primary/10",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}
        <span className="ml-auto font-sans text-[12px] font-light text-text-secondary/60">{resultCount} items</span>
      </div>
    </div>
  );
}
