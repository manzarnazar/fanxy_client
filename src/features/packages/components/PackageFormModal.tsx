"use client";

import { Loader2, MessageCircle, Radio, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PACKAGE_PERIODS } from "@/features/packages/constants/packages";
import type { PackageFormInput } from "@/features/packages/types/packages.types";

interface PackageFormModalProps {
  open: boolean;
  isEditing: boolean;
  onClose: () => void;
  form: PackageFormInput;
  onFieldChange: <TKey extends keyof PackageFormInput>(key: TKey, value: PackageFormInput[TKey]) => void;
  saving: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}

export function PackageFormModal({ open, isEditing, onClose, form, onFieldChange, saving, canSubmit, onSubmit }: PackageFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? "Edit package" : "Create package"}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-[460px] flex-col rounded-xl border border-primary/22 bg-surface-elevated"
      >
        <div className="flex items-center justify-between border-b border-primary/10 px-6.5 py-5">
          <div className="font-display text-xl font-semibold text-text-primary">{isEditing ? "Edit package" : "Create package"}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-md border border-primary/20 bg-surface/70 text-primary-light transition hover:bg-primary/12"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-6.5 py-5.5">
          <div>
            <label className="mb-1.5 block px-1 font-sans text-[10px] font-medium tracking-wider text-text-muted uppercase">Package name</label>
            <input
              value={form.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
              placeholder="e.g. Premium VIP"
              className="w-full rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5 font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block px-1 font-sans text-[10px] font-medium tracking-wider text-text-muted uppercase">Price ($)</label>
              <input
                value={form.price}
                onChange={(event) => onFieldChange("price", event.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="9.99"
                className="w-full rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5 font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
              />
            </div>
            <div>
              <label className="mb-1.5 block px-1 font-sans text-[10px] font-medium tracking-wider text-text-muted uppercase">Billed every</label>
              <div className="flex gap-2">
                <input
                  value={form.periodCount}
                  onChange={(event) => onFieldChange("periodCount", event.target.value)}
                  type="number"
                  min="1"
                  className="w-16 rounded-md border border-primary/16 bg-surface/60 px-2.5 py-2.5 font-sans text-[13px] text-text-primary outline-none"
                />
                <select
                  value={form.period}
                  onChange={(event) => onFieldChange("period", event.target.value as PackageFormInput["period"])}
                  className="flex-1 rounded-md border border-primary/16 bg-surface/60 px-2.5 py-2.5 font-sans text-[13px] text-text-primary outline-none"
                >
                  {PACKAGE_PERIODS.map((period) => (
                    <option key={period} value={period}>
                      {period}
                      {Number(form.periodCount) > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-primary/12 bg-surface/40 p-3.5">
            <div className="mb-2.5 font-sans text-[11px] font-medium tracking-wide text-text-muted uppercase">Package features</div>
            <label className="flex items-center justify-between gap-2.5 py-1.5">
              <span className="flex items-center gap-2 font-sans text-[13px] text-text-secondary">
                <MessageCircle className="h-4 w-4 text-primary-light" aria-hidden="true" />
                Private chat
              </span>
              <input
                type="checkbox"
                checked={form.canChat}
                onChange={(event) => onFieldChange("canChat", event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
            </label>
            <label className="flex items-center justify-between gap-2.5 py-1.5">
              <span className="flex items-center gap-2 font-sans text-[13px] text-text-secondary">
                <Radio className="h-4 w-4 text-primary-light" aria-hidden="true" />
                Live stream access
              </span>
              <input
                type="checkbox"
                checked={form.canViewLiveStream}
                onChange={(event) => onFieldChange("canViewLiveStream", event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
            </label>
            {isEditing && (
              <p className="mt-2 font-sans text-[10.5px] font-light text-text-secondary/55">
                These reset each time you edit — the current state can&apos;t be read back yet.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2.5 border-t border-primary/10 px-6.5 py-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-primary/20 bg-surface/60 py-3 font-sans text-[13px] font-semibold text-text-secondary transition hover:bg-primary/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit || saving}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-3 font-sans text-[13px] font-semibold transition",
              canSubmit && !saving
                ? "bg-gradient-to-br from-primary-light to-primary text-[#03283a] hover:-translate-y-0.5"
                : "cursor-not-allowed bg-primary/30 text-[#03283a]/70",
            )}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {isEditing ? "Save changes" : "Create package"}
          </button>
        </div>
      </div>
    </div>
  );
}
