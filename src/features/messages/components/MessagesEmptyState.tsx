import { MessageCircle, Search, SquarePen } from "lucide-react";

interface MessagesEmptyStateProps {
  variant: "noResults" | "empty";
  onClearFilters: () => void;
  onStartNewChat: () => void;
}

export function MessagesEmptyState({ variant, onClearFilters, onStartNewChat }: MessagesEmptyStateProps) {
  const isNoResults = variant === "noResults";

  return (
    <div className="flex flex-col items-center px-6 py-12.5 text-center">
      <div className="mb-3.5 flex h-18 w-18 items-center justify-center rounded-xl bg-surface/60 shadow-[inset_0_0_0_1.5px_rgba(0,175,240,.25)] text-primary-light">
        {isNoResults ? <Search className="h-8 w-8" aria-hidden="true" /> : <MessageCircle className="h-8 w-8" aria-hidden="true" />}
      </div>
      <div className="font-display text-lg font-semibold text-text-primary">
        {isNoResults ? "No matching conversations" : "No conversations yet"}
      </div>
      <p className="mt-1.5 max-w-[220px] font-sans text-xs leading-relaxed font-light text-text-secondary/70">
        {isNoResults
          ? "Try another username or name."
          : "Start a new chat with your favorite creators and friends."}
      </p>
      <div className="mt-4 flex gap-2">
        {isNoResults ? (
          <>
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-md bg-gradient-to-br from-primary-light to-primary px-4 py-2.5 font-sans text-xs font-semibold text-[#03283a] transition hover:-translate-y-0.5"
            >
              Clear Search
            </button>
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-md border border-primary/22 bg-surface/70 px-4 py-2.5 font-sans text-xs font-medium text-text-secondary transition hover:bg-primary/10"
            >
              View All
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onStartNewChat}
            className="flex items-center gap-1.5 rounded-md bg-gradient-to-br from-primary-light to-primary px-4 py-2.5 font-sans text-xs font-semibold text-[#03283a] transition hover:-translate-y-0.5"
          >
            <SquarePen className="h-3.5 w-3.5" aria-hidden="true" />
            Start New Chat
          </button>
        )}
      </div>
    </div>
  );
}
