import { Trash2, X } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";
import type { CreatorPackage } from "@/features/packages/types/packages.types";

interface PackageDeleteModalProps {
  pkg: CreatorPackage | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function PackageDeleteModal({ pkg, onClose, onConfirm }: PackageDeleteModalProps) {
  if (!pkg) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Delete package"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[420px] rounded-xl border border-danger/28 bg-surface-elevated p-6.5"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-danger/14 text-danger">
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-md border border-primary/20 bg-surface/70 text-primary-light transition hover:bg-primary/12"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="font-display text-xl font-semibold text-text-primary">Delete package?</div>
        <p className="mt-2 font-sans text-[13px] leading-relaxed font-light text-text-secondary/75">
          &quot;{pkg.name}&quot; (${formatCount(pkg.price)} {pkg.billingLabel}) will be permanently removed. This cannot be undone.
        </p>

        <div className="mt-5.5 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-primary/20 bg-surface/60 py-3 font-sans text-[13px] font-semibold text-text-secondary transition hover:bg-primary/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-md bg-gradient-to-br from-danger to-danger-strong py-3 font-sans text-[13px] font-semibold text-white transition hover:-translate-y-0.5"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
