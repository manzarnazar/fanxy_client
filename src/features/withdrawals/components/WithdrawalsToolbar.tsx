import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { WithdrawalStatusFilter, WithdrawalsSort } from "@/features/withdrawals/types/withdrawals.types";

const STATUS_SEGMENTS: Array<{ key: WithdrawalStatusFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
];

const SORT_OPTIONS: Array<{ key: WithdrawalsSort; label: string }> = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "highest", label: "Highest amount" },
  { key: "lowest", label: "Lowest amount" },
];

interface WithdrawalsToolbarProps {
  statusFilter: WithdrawalStatusFilter;
  counts: Record<WithdrawalStatusFilter, number>;
  onStatusFilterChange: (filter: WithdrawalStatusFilter) => void;
  sort: WithdrawalsSort;
  onSortChange: (sort: WithdrawalsSort) => void;
  query: string;
  onQueryChange: (query: string) => void;
}

export function WithdrawalsToolbar({
  statusFilter,
  counts,
  onStatusFilterChange,
  sort,
  onSortChange,
  query,
  onQueryChange,
}: WithdrawalsToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <div className="flex rounded-md border border-primary/16 bg-surface/60 p-0.5">
        {STATUS_SEGMENTS.map((segment) => (
          <button
            key={segment.key}
            type="button"
            onClick={() => onStatusFilterChange(segment.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-[5px] px-3.5 py-1.5 font-sans text-[12px] font-medium transition",
              statusFilter === segment.key ? "bg-primary/16 text-primary-light" : "text-text-secondary hover:text-text-primary",
            )}
          >
            {segment.label}
            <span className="font-sans text-[10px] font-semibold opacity-70">{counts[segment.key]}</span>
          </button>
        ))}
      </div>

      <div className="flex h-10 min-w-[200px] flex-1 items-center gap-2 rounded-md border border-primary/16 bg-surface/60 px-3 focus-within:border-primary/45">
        <Search className="h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search amount, method, details…"
          aria-label="Search withdrawals"
          className="min-w-0 flex-1 bg-transparent font-sans text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        {query.length > 0 && (
          <button type="button" onClick={() => onQueryChange("")} aria-label="Clear search" className="text-text-secondary">
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value as WithdrawalsSort)}
        aria-label="Sort withdrawals"
        className="h-10 rounded-md border border-primary/16 bg-surface/60 px-3 font-sans text-[12.5px] text-text-secondary focus:border-primary/45 focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.key} value={option.key} className="bg-surface-elevated">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
