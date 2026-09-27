import { Lock } from "lucide-react";
import type {
  AppliedPromo,
  CheckoutCoinPack,
  CheckoutKind,
  CheckoutPackage,
  CheckoutStep,
  PaymentGatewayOption,
} from "@/features/checkout/types/checkout.types";

interface CheckoutConfirmStepProps {
  kind: CheckoutKind | null;
  pkg: CheckoutPackage | null;
  coinPack: CheckoutCoinPack | null;
  gateway: PaymentGatewayOption | null;
  appliedPromo: AppliedPromo | null;
  finalPrice: number;
  onEdit: (step: CheckoutStep) => void;
  onPay: () => void;
}

export function CheckoutConfirmStep({
  kind,
  pkg,
  coinPack,
  gateway,
  appliedPromo,
  finalPrice,
  onEdit,
  onPay,
}: CheckoutConfirmStepProps) {
  const basePrice = pkg?.price ?? coinPack?.price ?? 0;

  const rows = [
    {
      key: "item",
      label: kind === "coins" ? "Coin Pack" : "Subscription",
      value: pkg?.name ?? coinPack?.name ?? "—",
      editStep: "review" as CheckoutStep,
    },
    {
      key: "method",
      label: "Payment Method",
      value: gateway?.label ?? "—",
      editStep: "payment" as CheckoutStep,
    },
    ...(kind === "subscription"
      ? [
          {
            key: "promo",
            label: "Promo Code",
            value: appliedPromo ? appliedPromo.code.toUpperCase() : "None",
            editStep: "promo" as CheckoutStep,
          },
        ]
      : []),
  ];

  return (
    <div className="rounded-[20px] border border-primary/14 bg-surface/50 p-6">
      <h2 className="font-display text-xl font-semibold text-text-primary">Confirm &amp; Pay</h2>
      <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
        Review everything one last time.
      </p>

      <div className="mt-5 flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between rounded-xl border border-primary/12 bg-surface-elevated/30 px-4 py-3">
            <div>
              <div className="font-sans text-[10.5px] font-medium tracking-wide text-text-secondary/60 uppercase">{row.label}</div>
              <div className="mt-0.5 font-sans text-[13.5px] font-semibold text-text-primary">{row.value}</div>
            </div>
            <button
              type="button"
              onClick={() => onEdit(row.editStep)}
              className="rounded-md border border-primary/18 bg-surface/60 px-3 py-1.5 font-sans text-[11.5px] font-medium text-primary-light transition hover:bg-primary/12"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-primary/12 bg-surface-elevated/30 p-4">
        <div className="mb-2.5 font-sans text-[10.5px] font-semibold tracking-wide text-text-secondary/60 uppercase">
          Price Breakdown
        </div>
        <div className="flex flex-col gap-2 font-sans text-[12.5px]">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span>${basePrice.toFixed(2)}</span>
          </div>
          {appliedPromo && (
            <div className="flex justify-between text-success">
              <span>Discount ({appliedPromo.code.toUpperCase()})</span>
              <span>-${appliedPromo.discountPrice.toFixed(2)}</span>
            </div>
          )}
          <div className="mt-1 flex justify-between border-t border-primary/10 pt-2.5">
            <span className="font-semibold text-text-primary">Total</span>
            <span className="font-display text-lg font-semibold text-text-primary">${finalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onPay}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-3.5 font-sans text-[14.5px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
      >
        <Lock className="h-[17px] w-[17px]" aria-hidden="true" />
        {kind === "coins" ? "Purchase Coins" : "Subscribe Now"} · ${finalPrice.toFixed(2)}
      </button>
      <p className="mt-3 text-center font-sans text-[11px] font-light text-text-secondary/60">
        Your payment is completed in the gateway&apos;s secure window.
      </p>
    </div>
  );
}
