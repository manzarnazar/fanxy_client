import { ShieldCheck } from "lucide-react";
import type { BecomeCreatorInput } from "@/features/settings/types/settings.types";

interface BecomeCreatorBankStepProps {
  form: BecomeCreatorInput;
  onFieldChange: <TKey extends keyof BecomeCreatorInput>(key: TKey, value: BecomeCreatorInput[TKey]) => void;
  canContinue: boolean;
  onBack: () => void;
  onContinue: () => void;
}

const FIELDS: Array<{ key: "bankName" | "accountNo" | "ifscNo"; label: string; placeholder: string }> = [
  { key: "bankName", label: "Bank Name", placeholder: "e.g. HDFC Bank" },
  { key: "accountNo", label: "Account Number", placeholder: "Your account number" },
  { key: "ifscNo", label: "IFSC / SWIFT Code", placeholder: "e.g. HDFC0001234" },
];

export function BecomeCreatorBankStep({ form, onFieldChange, canContinue, onBack, onContinue }: BecomeCreatorBankStepProps) {
  return (
    <div className="rounded-[20px] border border-primary/14 bg-surface/50 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-text-primary">Bank Details</h2>
          <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
            Where you&apos;ll receive your creator earnings.
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-success/24 bg-success/10 px-3 py-1 font-sans text-[10.5px] font-medium text-success">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Secure
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block font-sans text-[11.5px] font-medium tracking-wide text-text-secondary/70 uppercase">
              {field.label}
            </label>
            <input
              value={form[field.key]}
              onChange={(event) => onFieldChange(field.key, event.target.value)}
              placeholder={field.placeholder}
              className="h-12 w-full rounded-md border border-primary/16 bg-surface/70 px-3.5 font-sans text-[13.5px] text-text-primary placeholder:text-text-muted focus:border-primary/45 focus:outline-none"
            />
          </div>
        ))}
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
          disabled={!canContinue}
          onClick={onContinue}
          className="flex-1 rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-2.5 font-sans text-[13.5px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
        >
          Continue to Verification
        </button>
      </div>
    </div>
  );
}
