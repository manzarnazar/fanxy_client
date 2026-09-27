import { Search, Users } from "lucide-react";

interface SubscribersEmptyStateProps {
  isFiltered: boolean;
  onClear: () => void;
}

export function SubscribersEmptyState({ isFiltered, onClear }: SubscribersEmptyStateProps) {
  const Icon = isFiltered ? Search : Users;

  return (
    <div className="flex flex-col items-center px-10 py-16 text-center">
      <div className="relative mb-5 h-24 w-24">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" aria-hidden="true" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-surface/60 shadow-[inset_0_0_0_1.5px_rgba(0,175,240,.3)]">
          <Icon className="h-10.5 w-10.5 text-primary-light" aria-hidden="true" />
        </div>
      </div>
      <div className="font-display text-[23px] font-semibold text-text-primary">
        {isFiltered ? "No matching subscribers" : "No subscribers yet"}
      </div>
      <p className="mt-2 max-w-[320px] font-sans text-[13px] leading-relaxed font-light text-text-secondary/75">
        {isFiltered ? "Try a different keyword or filter." : "Once someone subscribes to one of your packages, they'll show up here."}
      </p>
      {isFiltered && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-md bg-gradient-to-br from-primary-light to-primary px-5.5 py-3 font-sans text-[13px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
