"use client";

import { useSearchParams } from "next/navigation";
import { Loader2, Lock, ShieldCheck, ShoppingBag } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useCheckout } from "@/features/checkout/hooks/useCheckout";
import { CheckoutStepper } from "@/features/checkout/components/CheckoutStepper";
import { CheckoutSummaryCard } from "@/features/checkout/components/CheckoutSummaryCard";
import { CheckoutReviewStep } from "@/features/checkout/components/CheckoutReviewStep";
import { CheckoutPromoStep } from "@/features/checkout/components/CheckoutPromoStep";
import { CheckoutPaymentStep } from "@/features/checkout/components/CheckoutPaymentStep";
import { CheckoutConfirmStep } from "@/features/checkout/components/CheckoutConfirmStep";
import { CheckoutProcessingOverlay } from "@/features/checkout/components/CheckoutProcessingOverlay";
import { CheckoutResultStep } from "@/features/checkout/components/CheckoutResultStep";

const TRUST_BADGES = ["256-bit Encryption", "SSL Protected", "Trusted Payments"];

export function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);

  const rawKind = searchParams.get("type");
  const kind = rawKind === "coins" ? "coins" : rawKind === "subscription" ? "subscription" : null;
  const creatorId = searchParams.get("creator");
  const packageId = searchParams.get("package");

  const checkout = useCheckout({ kind, creatorId, packageId });

  if (!isBootstrapped) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[680px]">
          <SectionStateMessage
            variant="empty"
            title="Sign in to continue"
            body="You need an account to complete a purchase."
            emptyHref={ROUTES.SIGN_IN}
            emptyLabel="Sign In"
          />
        </div>
      </main>
    );
  }

  const invalidParams = !kind || !packageId || (kind === "subscription" && !creatorId);

  if (invalidParams) {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[680px]">
          <SectionStateMessage
            variant="empty"
            icon={ShoppingBag}
            title="Nothing to check out"
            body="Open a creator's package or a coin pack to start a purchase."
            emptyHref={ROUTES.HOME}
            emptyLabel="Explore Creators"
          />
        </div>
      </main>
    );
  }

  const selectedGateway = checkout.gateways.find((gateway) => gateway.key === checkout.selectedGatewayKey) ?? null;
  const backFromPayment = kind === "coins" ? "review" : "promo";

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-6 pb-[100px] lg:pb-6">
      <div className="mx-auto max-w-[860px]">
        {/* Hero */}
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/24 bg-success/10 px-3.5 py-1 font-sans text-[11px] font-medium text-success">
            <Lock className="h-3 w-3" aria-hidden="true" />
            Secure Payment
          </span>
          <h1 className="mt-2.5 font-display text-[30px] leading-tight font-semibold text-text-primary">Secure Checkout</h1>
          <p className="mt-1 font-sans text-[13px] font-light text-text-secondary/75">
            Complete your purchase securely using your preferred payment method.
          </p>
          <div className="mt-3.5 flex flex-wrap justify-center gap-2">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-1.5 rounded-full border border-primary/14 bg-surface/50 px-3 py-1 font-sans text-[10.5px] font-medium text-text-secondary"
              >
                <ShieldCheck className="h-3 w-3 text-success" aria-hidden="true" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        {checkout.initStatus === "loading" || checkout.initStatus === "idle" ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
          </div>
        ) : checkout.initStatus === "failed" ? (
          <SectionStateMessage
            variant="error"
            title="Unable to load checkout"
            body={checkout.error ?? "Something went wrong. Please try again."}
          />
        ) : (
          <>
            <CheckoutStepper kind={checkout.kind} step={checkout.step} onStepClick={checkout.setStep} />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
              <div>
                {checkout.step === "review" && (
                  <CheckoutReviewStep
                    pkg={checkout.pkg}
                    coinPack={checkout.coinPack}
                    onContinue={() => checkout.setStep(kind === "coins" ? "payment" : "promo")}
                  />
                )}

                {checkout.step === "promo" && (
                  <CheckoutPromoStep
                    promoCodes={checkout.promoCodes}
                    appliedPromo={checkout.appliedPromo}
                    applying={checkout.applyingPromo}
                    promoError={checkout.promoError}
                    onApply={checkout.applyPromo}
                    onClear={checkout.clearPromo}
                    onBack={() => checkout.setStep("review")}
                    onContinue={() => checkout.setStep("payment")}
                  />
                )}

                {checkout.step === "payment" && (
                  <CheckoutPaymentStep
                    gateways={checkout.gateways}
                    selectedKey={checkout.selectedGatewayKey}
                    onSelect={checkout.selectGateway}
                    onBack={() => checkout.setStep(backFromPayment)}
                    onContinue={() => checkout.setStep("confirm")}
                  />
                )}

                {checkout.step === "confirm" && (
                  <CheckoutConfirmStep
                    kind={checkout.kind}
                    pkg={checkout.pkg}
                    coinPack={checkout.coinPack}
                    gateway={selectedGateway}
                    appliedPromo={checkout.appliedPromo}
                    finalPrice={checkout.finalPrice}
                    onEdit={checkout.setStep}
                    onPay={() => void checkout.pay()}
                  />
                )}

                {checkout.step === "result" && checkout.outcome && (
                  <CheckoutResultStep
                    kind={checkout.kind}
                    outcome={checkout.outcome}
                    receipt={checkout.receipt}
                    onRetry={() => checkout.setStep("confirm")}
                    onChangeMethod={() => checkout.setStep("payment")}
                  />
                )}
              </div>

              {checkout.step !== "result" && (
                <div className="hidden lg:block">
                  <CheckoutSummaryCard
                    pkg={checkout.pkg}
                    coinPack={checkout.coinPack}
                    appliedPromo={checkout.appliedPromo}
                    finalPrice={checkout.finalPrice}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {checkout.processing && <CheckoutProcessingOverlay />}
    </main>
  );
}
