"use client";

import { Crown, Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useBecomeCreatorWizard } from "@/features/become-creator/hooks/useBecomeCreatorWizard";
import { BecomeCreatorStepper } from "@/features/become-creator/components/BecomeCreatorStepper";
import { BecomeCreatorBenefitsStep } from "@/features/become-creator/components/BecomeCreatorBenefitsStep";
import { BecomeCreatorBankStep } from "@/features/become-creator/components/BecomeCreatorBankStep";
import { BecomeCreatorIdentityStep } from "@/features/become-creator/components/BecomeCreatorIdentityStep";
import { BecomeCreatorReviewStep } from "@/features/become-creator/components/BecomeCreatorReviewStep";
import { BecomeCreatorSuccessStep } from "@/features/become-creator/components/BecomeCreatorSuccessStep";

export function BecomeCreatorPageContent() {
  const { isBootstrapped } = useAppSelector((state) => state.auth);
  const wizard = useBecomeCreatorWizard();

  if (!isBootstrapped) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  if (!wizard.user) {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[680px]">
          <SectionStateMessage
            variant="empty"
            title="Sign in to apply"
            body="Create an account or sign in to start your creator application."
            emptyHref={ROUTES.SIGN_IN}
            emptyLabel="Sign In"
          />
        </div>
      </main>
    );
  }

  if (wizard.user.role === "creator") {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[680px]">
          <SectionStateMessage
            variant="empty"
            icon={Crown}
            title="You're already a creator"
            body="Your creator tools are ready — manage content, packages and earnings from your dashboard."
            emptyHref={ROUTES.CREATOR_DASHBOARD}
            emptyLabel="Open Creator Dashboard"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-6 pb-[100px] lg:pb-6">
      <div className="mx-auto max-w-[760px]">
        {wizard.step !== "success" && (
          <div className="mb-6 text-center">
            <span className="inline-block rounded-full border border-primary/22 bg-primary/10 px-3.5 py-1 font-sans text-[10.5px] font-medium tracking-wide text-primary-light">
              Creator Onboarding
            </span>
            <h1 className="mt-2.5 font-display text-[30px] leading-tight font-semibold text-text-primary">
              Become a Creator
            </h1>
            <p className="mt-1 font-sans text-[13px] font-light text-text-secondary/75">
              Start earning by sharing exclusive content and growing your community.
            </p>
          </div>
        )}

        <BecomeCreatorStepper step={wizard.step} onStepClick={wizard.setStep} />

        {wizard.step === "benefits" && <BecomeCreatorBenefitsStep onStart={() => wizard.setStep("bank")} />}

        {wizard.step === "bank" && (
          <BecomeCreatorBankStep
            form={wizard.form}
            onFieldChange={wizard.setField}
            canContinue={wizard.bankComplete}
            onBack={() => wizard.setStep("benefits")}
            onContinue={() => wizard.setStep("identity")}
          />
        )}

        {wizard.step === "identity" && (
          <BecomeCreatorIdentityStep
            form={wizard.form}
            onFieldChange={wizard.setField}
            onBack={() => wizard.setStep("bank")}
            onContinue={() => wizard.setStep("review")}
          />
        )}

        {wizard.step === "review" && (
          <BecomeCreatorReviewStep
            form={wizard.form}
            termsAccepted={wizard.termsAccepted}
            onTermsChange={wizard.setTermsAccepted}
            saving={wizard.saving}
            onEdit={wizard.setStep}
            onSubmit={() => void wizard.submit()}
          />
        )}

        {wizard.step === "success" && <BecomeCreatorSuccessStep />}
      </div>
    </main>
  );
}
