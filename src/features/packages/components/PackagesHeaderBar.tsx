import { Plus } from "lucide-react";

interface PackagesHeaderBarProps {
  onCreate: () => void;
}

export function PackagesHeaderBar({ onCreate }: PackagesHeaderBarProps) {
  return (
    <div className="mb-4.5 flex items-center gap-3.5">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-[26px] leading-none font-semibold text-text-primary">Packages</h1>
        <p className="mt-1 font-sans text-[12.5px] font-light text-text-secondary/70">
          Create and manage the subscription tiers fans can buy.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="flex h-10.5 shrink-0 items-center gap-1.5 rounded-md bg-gradient-to-br from-primary-light to-primary px-4 font-sans text-[12.5px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        New Package
      </button>
    </div>
  );
}
