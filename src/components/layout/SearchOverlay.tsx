"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

interface SearchOverlayProps {
  open: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onClose: () => void;
}

export function SearchOverlay({ open, query, onQueryChange, onClose }: SearchOverlayProps) {
  const router = useRouter();

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onClose();
    router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col items-center pt-[90px]">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <form
        onSubmit={handleSubmit}
        className="relative w-[92%] max-w-[600px] animate-[rise_0.25s_ease_both] overflow-hidden rounded-xl border border-primary/24 bg-surface-elevated shadow-dropdown"
      >
        <div className="flex items-center gap-3 border-b border-primary/12 px-4.5 py-4">
          <Search className="h-5 w-5 shrink-0 text-primary-light" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search creators, posts, tags…"
            className="flex-1 bg-transparent font-sans text-base text-text-primary outline-none placeholder:text-placeholder"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-primary/18 bg-primary/10 text-text-secondary transition hover:text-text-primary"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4.5 py-6 text-center font-sans text-[13px] font-light text-text-secondary/70">
          {query.trim() ? "Press Enter to search" : "Start typing to search creators, posts and tags"}
        </div>
      </form>
    </div>
  );
}
