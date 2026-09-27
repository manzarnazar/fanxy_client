"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { cn } from "@/lib/utils/cn";
import { SORT_OPTIONS, VIEW_MODES } from "@/features/subscribers/constants/subscribers";
import type { SubscribersSort, SubscribersViewMode } from "@/features/subscribers/types/subscribers.types";

interface SubscribersToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  sort: SubscribersSort;
  onSortChange: (sort: SubscribersSort) => void;
  viewMode: SubscribersViewMode;
  onViewModeChange: (mode: SubscribersViewMode) => void;
  resultCount: number;
}

export function SubscribersToolbar({ query, onQueryChange, sort, onSortChange, viewMode, onViewModeChange, resultCount }: SubscribersToolbarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortAnchorRef = useRef<HTMLButtonElement | null>(null);
  const activeSortLabel = SORT_OPTIONS.find((option) => option.key === sort)?.label ?? "Most recent";

  return (
    <div className="mb-3.5 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex h-10.5 min-w-0 flex-1 items-center gap-2.5 rounded-md border border-primary/16 bg-surface/60 px-3.5">
          <Search className="h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name or package…"
            aria-label="Search subscribers"
            className="w-full bg-transparent font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
          />
          {query && (
            <button type="button" onClick={() => onQueryChange("")} aria-label="Clear search" className="shrink-0 text-text-secondary/50 hover:text-text-primary">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="shrink-0">
          <button
            ref={sortAnchorRef}
            type="button"
            onClick={() => setSortOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={sortOpen}
            className="flex h-10.5 items-center gap-1.5 rounded-md border border-primary/16 bg-surface/60 px-3.5 font-sans text-[12.5px] font-medium text-text-secondary transition hover:bg-primary/10"
          >
            {activeSortLabel}
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <DropdownMenu
            open={sortOpen}
            onClose={() => setSortOpen(false)}
            anchorRef={sortAnchorRef}
            ariaLabel="Sort subscribers"
            panelClassName="w-52 overflow-hidden rounded-md border border-primary/18 bg-surface-elevated py-1 shadow-dropdown"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSortChange(option.key);
                  setSortOpen(false);
                }}
                className="flex w-full items-center justify-between px-3.5 py-2.5 text-left font-sans text-[12.5px] text-text-secondary transition hover:bg-primary/10 hover:text-text-primary"
              >
                {option.label}
                {option.key === sort && <Check className="h-3.5 w-3.5 text-primary-light" aria-hidden="true" />}
              </button>
            ))}
          </DropdownMenu>
        </div>

        <div className="flex h-10.5 shrink-0 items-center gap-0.5 rounded-md border border-primary/16 bg-surface/60 p-1">
          {VIEW_MODES.map((mode) => {
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

      <span className="font-sans text-[12px] font-light text-text-secondary/60">{resultCount} subscribers</span>
    </div>
  );
}
