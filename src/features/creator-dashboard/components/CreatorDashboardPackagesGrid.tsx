import Image from "next/image";
import { Package } from "lucide-react";
import type { CreatorPackageItem } from "@/features/creator-dashboard/types/creator-dashboard.types";

interface CreatorDashboardPackagesGridProps {
  packages: CreatorPackageItem[];
}

export function CreatorDashboardPackagesGrid({ packages }: CreatorDashboardPackagesGridProps) {
  if (packages.length === 0) {
    return (
      <div>
        <div className="mb-3.5 font-display text-lg font-semibold text-text-primary">My packages</div>
        <div className="rounded-xl border border-primary/14 bg-surface/50 p-6.5 text-center font-sans text-[13px] font-light text-text-secondary/70">
          You haven&apos;t created any subscription packages yet.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3.5 font-display text-lg font-semibold text-text-primary">My packages</div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {packages.map((pkg) => (
          <div key={pkg.id} className="flex items-center gap-3.5 rounded-xl border border-primary/14 bg-surface/50 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary/12 text-primary-light">
              {pkg.imageUrl ? (
                <Image src={pkg.imageUrl} alt="" width={44} height={44} className="h-full w-full object-cover" />
              ) : (
                <Package className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-sans text-[13.5px] font-medium text-text-primary">{pkg.name}</div>
              <div className="font-sans text-[11px] font-light text-text-secondary/70">{pkg.durationLabel}</div>
            </div>
            <div className="shrink-0 font-sans text-[13.5px] font-semibold text-success">{pkg.price.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
