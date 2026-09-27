"use client";

import { useState } from "react";
import { BadgePercent, Check, Loader2, X } from "lucide-react";
import type { AppliedPromo, CreatorPromo } from "@/features/checkout/types/checkout.types";

interface CheckoutPromoStepProps {
  promoCodes: CreatorPromo[];
  appliedPromo: AppliedPromo | null;
  applying: boolean;
  promoError: string | null;
  onApply: (code: string) => void;
  onClear: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export function CheckoutPromoStep({
  promoCodes,
  appliedPromo,
  applying,
  promoError,
  onApply,
  onClear,
  onBack,
  onContinue,
}: CheckoutPromoStepProps) {
  const [code, setCode] = useState("");

  return (
    <div className="rounded-[20px] border border-primary/14 bg-surface/50 p-6">
      <h2 className="font-display text-xl font-semibold text-text-primary">Apply Promo Code</h2>
      <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
        Have a promo or coupon code? Add it to save on your order — or skip ahead.
      </p>

      {appliedPromo ? (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-success/28 bg-success/10 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success/16 text-success">
            <Check className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[13.5px] font-semibold text-text-primary uppercase">{appliedPromo.code}</span>
              <span className="rounded-full bg-success/16 px-2 py-0.5 font-sans text-[9px] font-bold tracking-wide text-success uppercase">
                Applied
              </span>
            </div>
            <div className="font-sans text-[12px] font-light text-text-secondary/75">
              −${appliedPromo.discountPrice.toFixed(2)} · you pay ${appliedPromo.finalPrice.toFixed(2)}
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 rounded-md border border-danger/24 bg-danger/8 px-3 py-1.5 font-sans text-[11.5px] font-medium text-danger transition hover:bg-danger/16"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Remove
          </button>
        </div>
      ) : (
        <>
          <div className="mt-5 flex gap-2.5">
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter promo or coupon code"
              aria-label="Promo code"
              className="h-12 min-w-0 flex-1 rounded-md border border-primary/16 bg-surface/70 px-3.5 font-sans text-[13.5px] text-text-primary uppercase placeholder:normal-case placeholder:text-text-muted focus:border-primary/40 focus:outline-none"
            />
            <button
              type="button"
              disabled={applying || code.trim().length === 0}
              onClick={() => onApply(code.trim())}
              className="flex h-12 items-center gap-1.5 rounded-md bg-gradient-to-br from-primary-light to-primary px-5 font-sans text-[13px] font-semibold text-[#03283a] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
            >
              {applying && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Apply
            </button>
          </div>
          {promoError && <p className="mt-2 font-sans text-[12px] text-danger">{promoError}</p>}

          {promoCodes.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 font-sans text-[10px] font-semibold tracking-[0.8px] text-text-secondary/60 uppercase">
                Available coupons
              </div>
              <div className="flex flex-col gap-2">
                {promoCodes.map((promo) => (
                  <button
                    key={promo.id}
                    type="button"
                    onClick={() => onApply(promo.code)}
                    className="flex items-center gap-3 rounded-xl border border-dashed border-primary/24 bg-surface-elevated/30 px-4 py-3 text-left transition hover:border-primary/45 hover:bg-primary/6"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary-light">
                      <BadgePercent className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-[13px] font-semibold text-text-primary uppercase">{promo.code}</span>
                        {promo.newUserOnly && (
                          <span className="rounded-full bg-secondary/14 px-2 py-0.5 font-sans text-[8.5px] font-bold tracking-wide text-secondary-light uppercase">
                            New fans only
                          </span>
                        )}
                      </div>
                      <div className="truncate font-sans text-[11.5px] font-light text-text-secondary/70">
                        {promo.name} · {promo.discountPercent}% off
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
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
          onClick={onContinue}
          className="flex-1 rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-2.5 font-sans text-[13.5px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
