"use client";

import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import type { UploadPostInput } from "@/features/my-content/types/my-content.types";

interface MyContentUploadModalProps {
  open: boolean;
  onClose: () => void;
  form: UploadPostInput;
  onFieldChange: <TKey extends keyof UploadPostInput>(key: TKey, value: UploadPostInput[TKey]) => void;
  saving: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}

export function MyContentUploadModal({ open, onClose, form, onFieldChange, saving, canSubmit, onSubmit }: MyContentUploadModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Upload post"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-[520px] flex-col rounded-xl border border-primary/22 bg-surface-elevated"
      >
        <div className="flex items-center justify-between border-b border-primary/10 px-6.5 py-5">
          <div className="font-display text-xl font-semibold text-text-primary">Upload post</div>
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
          <div className="flex gap-2">
            {(["image", "video"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onFieldChange("mediaType", type)}
                className={cn(
                  "flex-1 rounded-md border px-3.5 py-2 font-sans text-[12.5px] font-medium capitalize transition",
                  form.mediaType === type
                    ? "border-transparent bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
                    : "border-primary/18 bg-surface/60 text-text-secondary/85",
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <ImageUploadField
            label={form.mediaType === "video" ? "Video file" : "Image file"}
            file={form.mediaFiles[0] ?? null}
            onChange={(file) => onFieldChange("mediaFiles", file ? [file] : [])}
          />

          <input
            value={form.title}
            onChange={(event) => onFieldChange("title", event.target.value)}
            placeholder="Title (optional)"
            aria-label="Title"
            className="w-full rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5 font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
          />

          <textarea
            value={form.description}
            onChange={(event) => onFieldChange("description", event.target.value)}
            placeholder="Description"
            aria-label="Description"
            rows={3}
            className="w-full resize-none rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5 font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
          />

          <label className="flex items-center gap-2.5 font-sans text-[13px] text-text-secondary">
            <input
              type="checkbox"
              checked={form.isCommentEnabled}
              onChange={(event) => onFieldChange("isCommentEnabled", event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Allow comments
          </label>

          <label className="flex items-center gap-2.5 font-sans text-[13px] text-text-secondary">
            <input
              type="checkbox"
              checked={form.isScheduled}
              onChange={(event) => onFieldChange("isScheduled", event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Schedule for later
          </label>

          {form.isScheduled && (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={form.scheduleDate}
                onChange={(event) => onFieldChange("scheduleDate", event.target.value)}
                aria-label="Schedule date"
                className="w-full rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5 font-sans text-[13px] text-text-primary outline-none"
              />
              <input
                type="time"
                value={form.scheduleTime}
                onChange={(event) => onFieldChange("scheduleTime", event.target.value)}
                aria-label="Schedule time"
                className="w-full rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5 font-sans text-[13px] text-text-primary outline-none"
              />
            </div>
          )}
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
            {form.isScheduled ? "Schedule" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
