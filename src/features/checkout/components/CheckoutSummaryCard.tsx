import Image from "next/image";
import { Coins, Crown, ImageOff } from "lucide-react";
import type { AppliedPromo, CheckoutCoinPack, CheckoutPackage } from "@/features/checkout/types/checkout.types";

interface CheckoutSummaryCardProps {
  pkg: CheckoutPackage | null;
  coinPack: CheckoutCoinPack | null;
  appliedPromo: AppliedPromo | null;
  finalPrice: number;
}

export function CheckoutSummaryCard({ pkg, coinPack, appliedPromo, finalPrice }: CheckoutSummaryCardProps) {
  const basePrice = pkg?.price ?? coinPack?.price ?? 0;

  return (
    <div className="rounded-[20px] border border-primary/14 bg-surface/50 p-5">
      <div className="mb-3.5 font-display text-base font-semibold text-text-primary">Order Summary</div>

      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-elevated">
          {(pkg?.imageUrl ?? coinPack?.imageUrl) ? (
            <Image src={(pkg?.imageUrl ?? coinPack?.imageUrl) as string} alt="" fill sizes="48px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-primary-light">
              {coinPack ? <Coins className="h-5 w-5" aria-hidden="true" /> : pkg ? <Crown className="h-5 w-5" aria-hidden="true" /> : <ImageOff className="h-5 w-5" aria-hidden="true" />}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-sans text-[13.5px] font-semibold text-text-primary">
            {pkg?.name ?? coinPack?.name ?? "—"}
          </div>
          <div className="font-sans text-[11.5px] font-light text-text-secondary/70">
            {pkg ? pkg.billingLabel : coinPack ? `${coinPack.coins.toLocaleString()} coins` : ""}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-primary/10 pt-3.5 font-sans text-[12.5px]">
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
          <span className="font-semibold text-text-primary">Final Amount</span>
          <span className="font-display text-lg font-semibold text-text-primary">${finalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
