"use client";

import { useRef } from "react";
import { FileImage, Trash2, UploadCloud } from "lucide-react";
import type { BecomeCreatorInput } from "@/features/settings/types/settings.types";

interface BecomeCreatorIdentityStepProps {
  form: BecomeCreatorInput;
  onFieldChange: <TKey extends keyof BecomeCreatorInput>(key: TKey, value: BecomeCreatorInput[TKey]) => void;
  onBack: () => void;
  onContinue: () => void;
}

function UploadSlot({
  label,
  file,
  onSelect,
  onClear,
}: {
  label: string;
  file: File | null;
  onSelect: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="mb-1.5 block font-sans text-[11.5px] font-medium tracking-wide text-text-secondary/70 uppercase">
        {label}
      </label>
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-success/24 bg-success/8 px-4 py-3">
          <FileImage className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <div className="truncate font-sans text-[12.5px] font-medium text-text-primary">{file.name}</div>
            <div className="font-sans text-[10.5px] font-light text-text-secondary/65">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            aria-label={`Remove ${label}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-danger/24 bg-danger/8 text-danger transition hover:bg-danger/16"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed border-primary/28 bg-surface-elevated/30 px-4 py-6 transition hover:border-primary/50 hover:bg-primary/6"
        >
          <UploadCloud className="h-6 w-6 text-primary-light" aria-hidden="true" />
          <span className="font-sans text-[12.5px] font-medium text-text-primary">Browse image</span>
          <span className="font-sans text-[10.5px] font-light text-text-secondary/60">JPG or PNG · under 5 MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) onSelect(selected);
          event.target.value = "";
        }}
      />
    </div>
  );
}

export function BecomeCreatorIdentityStep({ form, onFieldChange, onBack, onContinue }: BecomeCreatorIdentityStepProps) {
  return (
    <div className="rounded-[20px] border border-primary/14 bg-surface/50 p-6">
      <h2 className="font-display text-xl font-semibold text-text-primary">Identity Verification</h2>
      <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
        Attach your government ID photos — optional, but it speeds up approval.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UploadSlot
          label="Government ID — Front"
          file={form.frontIdProofFile}
          onSelect={(file) => onFieldChange("frontIdProofFile", file)}
          onClear={() => onFieldChange("frontIdProofFile", null)}
        />
        <UploadSlot
          label="Government ID — Back"
          file={form.backIdProofFile}
          onSelect={(file) => onFieldChange("backIdProofFile", file)}
          onClear={() => onFieldChange("backIdProofFile", null)}
        />
      </div>

      <div className="mt-6 flex gap-2.5">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-primary/18 bg-surface/60 px-5 py-2.5 font-sans text-[13px] font-medium text-text-secondary transition hover:bg-primary/10"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-2.5 font-sans text-[13.5px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
        >
          Review Application
        </button>
      </div>
    </div>
  );
}
