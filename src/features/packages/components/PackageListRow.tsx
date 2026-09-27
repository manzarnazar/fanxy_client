import { Package as PackageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { packageColorClassName } from "@/features/packages/constants/packages";
import { PackageContextMenu } from "@/features/packages/components/PackageContextMenu";
import type { CreatorPackage } from "@/features/packages/types/packages.types";

interface PackageListRowProps {
  pkg: CreatorPackage;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function PackageListRow({ pkg, onEdit, onDuplicate, onDelete }: PackageListRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-primary/14 bg-surface/50 px-3.5 py-2.5 transition hover:border-primary/30">
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-md", packageColorClassName(pkg.id))}>
        <PackageIcon className="h-4.5 w-4.5" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate font-sans text-[13px] font-medium text-text-primary">{pkg.name}</div>
        <div className="mt-0.5 font-sans text-[10.5px] font-light text-text-secondary/60">Created {pkg.createdLabel}</div>
      </div>

      <div className="shrink-0 text-right">
        <div className="font-sans text-[13px] font-semibold text-text-primary">${formatCount(pkg.price)}</div>
        <div className="font-sans text-[10.5px] font-light text-text-secondary/60">{pkg.billingLabel}</div>
      </div>

      <PackageContextMenu onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} />
    </div>
  );
}
