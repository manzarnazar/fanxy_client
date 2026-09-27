import { Package as PackageIcon } from "lucide-react";
import { TiltCard } from "@/components/animations/TiltCard";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { packageColorClassName } from "@/features/packages/constants/packages";
import { PackageContextMenu } from "@/features/packages/components/PackageContextMenu";
import type { CreatorPackage } from "@/features/packages/types/packages.types";

interface PackageCardProps {
  pkg: CreatorPackage;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function PackageCard({ pkg, onEdit, onDuplicate, onDelete }: PackageCardProps) {
  return (
    <TiltCard className="h-full">
    <div className="h-full overflow-hidden rounded-xl border border-primary/14 bg-surface/50 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-2 p-4">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-md", packageColorClassName(pkg.id))}>
          <PackageIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <PackageContextMenu onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} />
      </div>

      <div className="px-4 pb-4">
        <div className="truncate font-sans text-[14.5px] font-semibold text-text-primary">{pkg.name}</div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-display text-2xl font-semibold text-text-primary">${formatCount(pkg.price)}</span>
          <span className="font-sans text-[11.5px] font-light text-text-secondary/60">{pkg.billingLabel}</span>
        </div>
        <div className="mt-3 font-sans text-[10.5px] font-light text-text-secondary/55">Created {pkg.createdLabel}</div>
      </div>
    </div>
    </TiltCard>
  );
}
