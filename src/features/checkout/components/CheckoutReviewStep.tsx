import Image from "next/image";
import { Coins, Crown } from "lucide-react";
import type { CheckoutCoinPack, CheckoutPackage } from "@/features/checkout/types/checkout.types";

interface CheckoutReviewStepProps {
  pkg: CheckoutPackage | null;
  coinPack: CheckoutCoinPack | null;
  onContinue: () => void;
}

export function CheckoutReviewStep({ pkg, coinPack, onContinue }: CheckoutReviewStepProps) {
  return (
    <div className="rounded-[20px] border border-primary/14 bg-surface/50 p-6">
      <h2 className="font-display text-xl font-semibold text-text-primary">Review Your Order</h2>
      <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
        Confirm the details before you continue.
      </p>

      <div className="mt-5 flex items-center gap-4 rounded-xl border border-primary/12 bg-surface-elevated/40 p-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
          {(pkg?.imageUrl ?? coinPack?.imageUrl) ? (
            <Image src={(pkg?.imageUrl ?? coinPack?.imageUrl) as string} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-primary-light">
              {coinPack ? <Coins className="h-7 w-7" aria-hidden="true" /> : <Crown className="h-7 w-7" aria-hidden="true" />}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-sans text-[15px] font-semibold text-text-primary">
              {pkg?.name ?? coinPack?.name}
            </span>
            {pkg && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-gold/16 px-2 py-0.5 font-sans text-[9px] font-bold tracking-wide text-accent-gold-light uppercase">
                <Crown className="h-3 w-3" aria-hidden="true" />
                Subscription
              </span>
            )}
          </div>
          <div className="mt-0.5 font-sans text-[12px] font-light text-text-secondary/70">
            {pkg ? `Renews ${pkg.billingLabel}` : coinPack ? `${coinPack.coins.toLocaleString()} coins · one-time purchase` : ""}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-[22px] font-semibold text-text-primary">
            ${(pkg?.price ?? coinPack?.price ?? 0).toFixed(2)}
          </div>
          {pkg && <div className="font-sans text-[10.5px] font-light text-text-secondary/60">{pkg.billingLabel}</div>}
        </div>
      </div>

      {pkg?.alreadyOwned && (
        <p className="mt-3.5 rounded-md border border-warning/24 bg-warning/10 px-3.5 py-2.5 font-sans text-[12px] text-warning">
          You already have an active subscription to this package — paying again will extend/renew it.
        </p>
      )}

      {pkg && (
        <p className="mt-3.5 font-sans text-[11.5px] font-light text-text-secondary/60">
          Your subscription starts immediately and lasts {pkg.billingLabel.replace("per ", "one ").replace("every ", "")}.
        </p>
      )}

      <button
        type="button"
        onClick={onContinue}
        className="mt-5 w-full rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-3 font-sans text-[14px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
      >
        Continue
      </button>
    </div>
  );
}
