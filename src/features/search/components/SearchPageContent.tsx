"use client";

import { Clock, Loader2, Search, SearchX, X } from "lucide-react";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { cn } from "@/lib/utils/cn";
import { useSearch } from "@/features/search/hooks/useSearch";
import { SearchResultCard } from "@/features/search/components/SearchResultCard";
import type { SearchCategory } from "@/features/search/types/search.types";

const CATEGORY_CHIPS: Array<{ key: SearchCategory; label: string }> = [
  { key: "all", label: "All" },
  { key: "creators", label: "Creators" },
  { key: "users", label: "Users" },
];

export function SearchPageContent() {
  const search = useSearch();
  const hasQuery = search.query.trim().length > 0;
  const isSearching = hasQuery && (search.status === "loading" || search.status === "idle");

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto flex max-w-[1060px] gap-5">
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h1 className="font-display text-[26px] leading-tight font-semibold text-text-primary">Search</h1>
              <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
                Discover creators and users.
              </p>
            </div>
            {hasQuery && search.status === "succeeded" && (
              <span className="font-sans text-[12px] font-light text-text-secondary/70">
                <span className="font-semibold text-text-primary">{search.totalLoaded}</span>
                {search.hasMore ? "+" : ""} results for &ldquo;{search.query.trim()}&rdquo;
              </span>
            )}
          </div>

          {/* Search bar */}
          <div className="flex h-[56px] items-center gap-3 rounded-xl border-1.5 border-primary/16 bg-surface/70 px-4 transition focus-within:border-primary/55 focus-within:shadow-ring">
            <Search className="h-5 w-5 shrink-0 text-primary-light" aria-hidden="true" />
            <input
              autoFocus
              value={search.query}
              onChange={(event) => search.setQuery(event.target.value)}
              placeholder="Search creators or users…"
              aria-label="Search creators or users"
              className="min-w-0 flex-1 bg-transparent font-sans text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            {hasQuery && (
              <button
                type="button"
                onClick={() => search.setQuery("")}
                aria-label="Clear search"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/12 text-text-secondary transition hover:bg-primary/20"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="mt-3.5 flex gap-1.5">
            {CATEGORY_CHIPS.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => search.setCategory(chip.key)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 font-sans text-[12px] font-medium transition",
                  search.category === chip.key
                    ? "bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
                    : "border border-primary/18 bg-surface/60 text-text-secondary/85 hover:bg-primary/10",
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {!hasQuery ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-primary/12 bg-surface/35 p-10 text-center">
                <Search className="h-10 w-10 text-primary-light/60" aria-hidden="true" />
                <p className="mt-3 font-display text-lg font-semibold text-text-primary">Find your people</p>
                <p className="mt-1 max-w-[340px] font-sans text-[12.5px] leading-relaxed font-light text-text-secondary/75">
                  Type a name or username to find creators and users.
                </p>
                {search.recentSearches.length > 0 && (
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {search.recentSearches.map((recent) => (
                      <button
                        key={recent}
                        type="button"
                        onClick={() => search.setQuery(recent)}
                        className="flex items-center gap-1.5 rounded-full border border-primary/18 bg-surface/60 px-3.5 py-1.5 font-sans text-[12px] font-medium text-text-secondary transition hover:bg-primary/10 hover:text-text-primary"
                      >
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {recent}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : isSearching ? (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[120px] animate-pulse rounded-[18px] border border-primary/10 bg-surface/40" />
                ))}
              </div>
            ) : search.status === "failed" ? (
              <SectionStateMessage
                variant="error"
                title="Search failed"
                body={search.error ?? "Something went wrong. Please try again."}
                onRetry={search.retry}
              />
            ) : search.results.length === 0 ? (
              <SectionStateMessage
                variant="empty"
                icon={SearchX}
                title="No one found"
                body={`We couldn't find anyone matching "${search.query.trim()}". Try another name or username.`}
                minHeightClassName="min-h-[280px]"
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {search.results.map((result) => (
                    <SearchResultCard key={result.id} result={result} />
                  ))}
                </div>
                {search.hasMore && (
                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={search.loadMore}
                      disabled={search.isLoadingMore}
                      className="flex items-center gap-2 rounded-md border border-primary/18 bg-surface/60 px-5 py-2.5 font-sans text-[13px] font-medium text-text-secondary transition hover:bg-primary/10 hover:text-text-primary disabled:opacity-60"
                    >
                      {search.isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                      Load more profiles
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Recent searches rail */}
        {search.recentSearches.length > 0 && (
          <aside className="hidden w-[280px] shrink-0 xl:block">
            <div className="rounded-[18px] border border-primary/14 bg-surface/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-[15px] font-semibold text-text-primary">Recent</span>
                <button
                  type="button"
                  onClick={search.clearRecents}
                  className="font-sans text-[11px] font-medium text-primary-light hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {search.recentSearches.map((recent) => (
                  <div key={recent} className="group flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-primary/8">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-text-secondary/50" aria-hidden="true" />
                    <button
                      type="button"
                      onClick={() => search.setQuery(recent)}
                      className="min-w-0 flex-1 truncate text-left font-sans text-[12.5px] font-medium text-text-secondary transition hover:text-text-primary"
                    >
                      {recent}
                    </button>
                    <button
                      type="button"
                      onClick={() => search.removeRecent(recent)}
                      aria-label={`Remove ${recent} from recent searches`}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-secondary/50 opacity-0 transition group-hover:opacity-100 hover:bg-primary/12 hover:text-text-primary"
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
