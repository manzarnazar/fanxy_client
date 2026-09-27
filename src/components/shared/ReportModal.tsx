"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/utils/toast";

interface ReportModalProps {
  title: string;
  reasons: string[];
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
}

export function ReportModal({
  title,
  reasons,
  open,
  onClose,
  onSubmit,
  successMessage = "Report submitted. Thank you for letting us know.",
  errorMessage = "Unable to submit report.",
}: ReportModalProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!reason || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(reason);
      toast.success(successMessage);
      onClose();
      setReason(null);
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
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[420px] rounded-xl border border-primary/22 bg-surface-elevated p-6.5 shadow-[0_40px_90px_-34px_rgba(0,0,0,.9)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="font-display text-xl font-semibold text-text-primary">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close report dialog"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-primary/20 bg-surface/70 text-primary-light transition hover:bg-primary/12"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {reasons.map((option) => {
            const isActive = reason === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setReason(option)}
                className={cn(
                  "flex items-center justify-between gap-2.5 rounded-md border px-3.5 py-3 text-left font-sans text-sm transition",
                  isActive
                    ? "border-primary/40 bg-primary/10 text-text-primary"
                    : "border-primary/12 bg-surface/50 text-text-secondary hover:bg-primary/6",
                )}
              >
                {option}
                {isActive && <Check className="h-4 w-4 text-primary-light" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!reason || isSubmitting}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark py-3.5 font-sans text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Submit report
        </button>
      </div>
    </div>
  );
}
