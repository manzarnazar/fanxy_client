"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Crown, Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import { checkoutService } from "@/features/checkout/services/checkout.service";
import { mapCheckoutPackage } from "@/features/checkout/mapper/checkout.mapper";
import { selectCurrencySymbol } from "@/store/slices/appSettingsSlice";
import type { CheckoutPackage } from "@/features/checkout/types/checkout.types";

interface SubscribePlansContentProps {
  creatorId: string;
}

/**
 * The creator's subscription plans — the web version of the Flutter app's
 * subscription screen (get_creator_package by to_user_id). Picking a plan
 * goes into the real checkout; is_buy === 1 plans show as already active.
 */
export function SubscribePlansContent({ creatorId }: SubscribePlansContentProps) {
  const searchParams = useSearchParams();
  const creatorName = searchParams.get("name") ?? "this creator";
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const currencySymbol = useAppSelector(selectCurrencySymbol);

  // Result is tagged with the creator it belongs to, so a stale response
  // from a previous creatorId renders as "loading" instead of wrong data.
  const [result, setResult] = useState<{ creatorId: string; plans: CheckoutPackage[] | null; failed: boolean } | null>(
    null,
  );

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    checkoutService
      .getCreatorPackages(creatorId)
      .then((response) => {
        if (cancelled) return;
        setResult({ creatorId, plans: response.data.result.map((row) => mapCheckoutPackage(row, creatorId)), failed: false });
      })
      .catch(() => {
        if (!cancelled) setResult({ creatorId, plans: null, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [creatorId, user]);

  const current = result?.creatorId === creatorId ? result : null;
  const plans = current?.plans ?? null;
  const failed = current?.failed ?? false;

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
            title="Sign in to subscribe"
            body="Create an account or sign in to subscribe to creators."
            emptyHref={ROUTES.SIGN_IN}
            emptyLabel="Sign In"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-6 pb-[100px] lg:pb-6">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary-light/24 bg-secondary/10 px-3.5 py-1 font-sans text-[10.5px] font-medium tracking-wide text-[#ff9caa]">
            <Crown className="h-3 w-3" aria-hidden="true" />
            Subscription Plans
          </span>
          <h1 className="mt-2.5 font-display text-[28px] leading-tight font-semibold text-text-primary">
            Subscribe to {creatorName}
          </h1>
          <p className="mt-1 font-sans text-[13px] font-light text-text-secondary/75">
            Unlock exclusive posts, reels, stories and more.
          </p>
        </div>

        {plans === null && !failed ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[150px] animate-pulse rounded-[20px] border border-primary/10 bg-surface/40" />
            ))}
          </div>
        ) : failed ? (
          <SectionStateMessage
            variant="error"
            title="Unable to load plans"
            body="Something went wrong loading this creator's packages."
          />
        ) : plans !== null && plans.length === 0 ? (
          <SectionStateMessage
            variant="empty"
            icon={Crown}
            title="No plans available"
            body="This creator hasn't published any subscription packages yet."
            emptyHref={ROUTES.HOME}
            emptyLabel="Back to Home"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {plans?.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-[20px] border p-5",
                  plan.alreadyOwned ? "border-success/30 bg-success/6" : "border-primary/14 bg-surface/50",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex items-center gap-1.5 rounded-full bg-accent-gold/14 px-2.5 py-1 font-sans text-[10px] font-bold tracking-wide text-accent-gold-light uppercase">
                    <Crown className="h-3 w-3" aria-hidden="true" />
                    {plan.name}
                  </span>
                  {plan.alreadyOwned && (
                    <span className="flex items-center gap-1 rounded-full bg-success/14 px-2.5 py-1 font-sans text-[9.5px] font-bold tracking-wide text-success uppercase">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Active
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-display text-[32px] leading-none font-semibold text-text-primary">
                    {currencySymbol}
                    {plan.price}
                  </span>
                  <span className="font-sans text-[12px] font-light text-text-muted">{plan.billingLabel}</span>
                </div>

                <div className="mt-auto pt-5">
                  {plan.alreadyOwned ? (
                    <div className="rounded-md border border-success/24 bg-success/8 px-4 py-2.5 text-center font-sans text-[13px] font-medium text-success">
                      You&apos;re subscribed
                    </div>
                  ) : (
                    <Link
                      href={ROUTES.CHECKOUT_SUBSCRIPTION(creatorId, plan.id)}
                      className="flex items-center justify-center gap-1.5 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark px-4 py-2.5 font-sans text-[13.5px] font-semibold text-white shadow-[0_12px_26px_-12px_rgba(226,29,91,.7)] transition hover:-translate-y-0.5"
                    >
                      Subscribe
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
