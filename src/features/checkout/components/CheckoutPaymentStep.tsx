import { Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { PaymentGatewayOption } from "@/features/checkout/types/checkout.types";

interface CheckoutPaymentStepProps {
  gateways: PaymentGatewayOption[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function CheckoutPaymentStep({
  gateways,
  selectedKey,
  onSelect,
  onBack,
  onContinue,
}: CheckoutPaymentStepProps) {
  const selected = gateways.find((gateway) => gateway.key === selectedKey);

  return (
    <div className="rounded-[20px] border border-primary/14 bg-surface/50 p-6">
      <h2 className="font-display text-xl font-semibold text-text-primary">
        Payment Method
      </h2>
      <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
        Choose how you&apos;d like to pay.
      </p>

      {gateways.length === 0 ? (
        <p className="mt-5 rounded-md border border-warning/24 bg-warning/10 px-3.5 py-2.5 font-sans text-[12px] text-warning">
          No payment methods are enabled right now. Please try again later.
        </p>
      ) : !gateways.some((gateway) => gateway.webSupported) ? (
        <p className="mt-5 rounded-md border border-warning/24 bg-warning/10 px-3.5 py-2.5 font-sans text-[12px] text-warning">
          None of the enabled payment methods work on the web yet — payments are
          currently mobile-app only. Web payments need Razorpay enabled in the
          admin panel.
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {gateways.map((gateway) => {
            const isActive = gateway.key === selectedKey;
            return (
              <button
                key={gateway.key}
                type="button"
                disabled={!gateway.webSupported}
                onClick={() => onSelect(gateway.key)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3.5 text-left transition",
                  isActive
                    ? "border-primary/45 bg-primary/10"
                    : "border-primary/14 bg-surface-elevated/30 hover:border-primary/30",
                  !gateway.webSupported && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-display text-[15px] font-semibold",
                    isActive
                      ? "bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
                      : "bg-primary/12 text-primary-light",
                  )}
                >
                  {gateway.label.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-[13.5px] font-semibold text-text-primary">
                    {gateway.label}
                  </div>
                  <div className="truncate font-sans text-[11px] font-light text-text-secondary/70">
                    {gateway.sublabel}
                  </div>
                </div>
                <span
                  className={cn(
                    "h-4 w-4 shrink-0 rounded-full border-2",
                    isActive
                      ? "border-primary-light bg-primary-light"
                      : "border-primary/25",
                  )}
                />
              </button>
            );
          })}
        </div>
      )}

      {selected?.webSupported && (
        <p className="mt-4 flex items-center gap-2 rounded-md border border-primary/14 bg-surface-elevated/30 px-3.5 py-2.5 font-sans text-[12px] font-light text-text-secondary">
          <ShieldCheck
            className="h-4 w-4 shrink-0 text-success"
            aria-hidden="true"
          />
          You&apos;ll complete the payment in {selected.label}&apos;s secure
          window — card details never touch Fanxy.
        </p>
      )}

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
          disabled={!selected?.webSupported}
          onClick={onContinue}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-2.5 font-sans text-[13.5px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
          Review Payment
        </button>
      </div>
    </div>
  );
}
