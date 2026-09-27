import { Package as PackageIcon, Search } from "lucide-react";

interface PackagesEmptyStateProps {
  isFiltered: boolean;
  onClear: () => void;
  onCreate: () => void;
}

export function PackagesEmptyState({ isFiltered, onClear, onCreate }: PackagesEmptyStateProps) {
  const Icon = isFiltered ? Search : PackageIcon;

  return (
    <div className="flex flex-col items-center px-10 py-16 text-center">
      <div className="relative mb-5 h-24 w-24">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" aria-hidden="true" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-surface/60 shadow-[inset_0_0_0_1.5px_rgba(0,175,240,.3)]">
          <Icon className="h-10.5 w-10.5 text-primary-light" aria-hidden="true" />
        </div>
      </div>
      <div className="font-display text-[23px] font-semibold text-text-primary">
        {isFiltered ? "No matching packages" : "No packages yet"}
      </div>
      <p className="mt-2 max-w-[320px] font-sans text-[13px] leading-relaxed font-light text-text-secondary/75">
        {isFiltered ? "Try a different keyword or filter." : "Create your first package to start earning from subscriptions."}
      </p>
      <button
        type="button"
        onClick={isFiltered ? onClear : onCreate}
        className="mt-5 rounded-md bg-gradient-to-br from-primary-light to-primary px-5.5 py-3 font-sans text-[13px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
      >
        {isFiltered ? "Clear filters" : "Create Package"}
      </button>
    </div>
  );
}
