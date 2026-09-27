import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MessagesSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function MessagesSearchBar({ query, onQueryChange }: MessagesSearchBarProps) {
  return (
    <div
      className={cn(
        "mt-3.5 flex h-11.5 items-center gap-2.5 rounded-md border-1.5 border-primary/16 bg-surface/70 px-3.5 transition focus-within:border-primary/60 focus-within:shadow-ring",
      )}
    >
      <Search className="h-[17px] w-[17px] shrink-0 text-primary-light" aria-hidden="true" />
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search conversations…"
        aria-label="Search conversations"
        className="min-w-0 flex-1 bg-transparent font-sans text-sm font-normal text-text-primary placeholder:text-text-muted focus:outline-none"
      />
      {query.length > 0 && (
        <button
          type="button"
          onClick={() => onQueryChange("")}
          aria-label="Clear search"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/12 text-text-secondary transition hover:bg-primary/20"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
