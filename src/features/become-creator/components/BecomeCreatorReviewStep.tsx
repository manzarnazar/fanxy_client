import { Loader2, Lock } from "lucide-react";
import type { BecomeCreatorInput } from "@/features/settings/types/settings.types";
import type { BecomeCreatorStep } from "@/features/become-creator/hooks/useBecomeCreatorWizard";

interface BecomeCreatorReviewStepProps {
  form: BecomeCreatorInput;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  saving: boolean;
  onEdit: (step: BecomeCreatorStep) => void;
  onSubmit: () => void;
}

export function BecomeCreatorReviewStep({
  form,
  termsAccepted,
  onTermsChange,
  saving,
  onEdit,
  onSubmit,
}: BecomeCreatorReviewStepProps) {
  const maskedAccount = form.accountNo.length > 4 ? `•••• ${form.accountNo.slice(-4)}` : form.accountNo;

  const sections = [
    {
      key: "bank",
      title: "Bank Details",
      editStep: "bank" as BecomeCreatorStep,
      rows: [
        { label: "Bank Name", value: form.bankName || "—" },
        { label: "Account Number", value: maskedAccount || "—" },
        { label: "IFSC / SWIFT", value: form.ifscNo || "—" },
      ],
    },
    {
      key: "identity",
      title: "Identity Documents",
      editStep: "identity" as BecomeCreatorStep,
      rows: [
        { label: "ID Front", value: form.frontIdProofFile ? "Uploaded ✓" : "Not attached (optional)" },
        { label: "ID Back", value: form.backIdProofFile ? "Uploaded ✓" : "Not attached (optional)" },
      ],
    },
  ];

  return (
    <div className="rounded-[20px] border border-primary/14 bg-surface/50 p-6">
      <h2 className="font-display text-xl font-semibold text-text-primary">Review &amp; Submit</h2>
      <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
        Check everything before sending your application.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {sections.map((section) => (
          <div key={section.key} className="rounded-xl border border-primary/12 bg-surface-elevated/30 p-4">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="font-sans text-[13px] font-semibold text-text-primary">{section.title}</span>
              <button
                type="button"
                onClick={() => onEdit(section.editStep)}
                className="rounded-md border border-primary/18 bg-surface/60 px-3 py-1 font-sans text-[11.5px] font-medium text-primary-light transition hover:bg-primary/12"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {section.rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 font-sans text-[12.5px]">
                  <span className="text-text-secondary/70">{row.label}</span>
                  <span className="font-medium text-text-primary">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) => onTermsChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#0085c7]"
        />
        <span className="font-sans text-[12.5px] leading-relaxed font-light text-text-secondary">
          I confirm the information provided is accurate and belongs to me, and I agree to the Creator Terms &amp;
          Conditions. I understand approval is subject to review by the platform.
        </span>
      </label>

      <button
        type="button"
        disabled={saving || !termsAccepted}
        onClick={onSubmit}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-3 font-sans text-[14px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
        Submit Creator Application
      </button>
    </div>
  );
}
