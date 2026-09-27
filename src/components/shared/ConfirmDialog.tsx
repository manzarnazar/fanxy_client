"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "@/lib/utils/toast";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  destructive?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  open,
  onClose,
  onConfirm,
  successMessage,
  errorMessage = "Something went wrong. Please try again.",
  destructive = true,
}: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm();
      if (successMessage) toast.success(successMessage);
      onClose();
    } catch {
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[400px] rounded-xl border border-primary/22 bg-surface-elevated p-6.5 shadow-[0_40px_90px_-34px_rgba(0,0,0,.9)]"
      >
        <div className="mb-3.5 flex items-center justify-between">
          <div className="font-display text-xl font-semibold text-text-primary">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-primary/20 bg-surface/70 text-primary-light transition hover:bg-primary/12"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="font-sans text-sm leading-relaxed font-light text-text-secondary">{description}</p>

        <div className="mt-5.5 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-primary/20 bg-surface/60 py-3 font-sans text-sm font-semibold text-text-secondary transition hover:bg-primary/8"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={isSubmitting}
            className={
              destructive
                ? "flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark py-3 font-sans text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                : "flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary-light to-primary py-3 font-sans text-sm font-semibold text-[#03283a] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            }
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
