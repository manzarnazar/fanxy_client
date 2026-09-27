"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { TiltCard } from "@/components/animations/TiltCard";
import { cn } from "@/lib/utils/cn";
import { PRICING_PLANS } from "@/features/landing/constants/landing";
import { LandingSectionHeading } from "@/features/landing/components/LandingSectionHeading";

interface LandingPricingPreviewProps {
  onGetStarted: () => void;
}

export function LandingPricingPreview({
  onGetStarted,
}: LandingPricingPreviewProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-background px-6.5 py-20">
      <LandingSectionHeading
        eyebrow="Subscriber pricing"
        title="Creators set their own price"
        description="Every creator on Fanxy chooses their own subscription tiers — here's a typical example."
      />

      <div className="mx-auto mt-12 grid max-w-[980px] grid-cols-1 gap-6 sm:grid-cols-3">
        {PRICING_PLANS.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
          >
            <TiltCard
              maxTilt={5}
              className={cn(
                "flex h-full flex-col rounded-md border p-7",
                plan.highlighted
                  ? "border-primary/40 bg-gradient-to-b from-primary/12 to-transparent shadow-[0_16px_40px_-20px_rgba(0,133,199,0.4)]"
                  : "border-primary/12 bg-surface-elevated/50",
              )}
            >
              {plan.highlighted && (
                <span className="mb-3 w-fit rounded-full bg-gradient-to-br from-primary-light to-primary px-3 py-1 font-sans text-[10.5px] font-semibold text-[#03283a]">
                  Most Popular
                </span>
              )}
              <h3 className="font-sans text-[16px] font-semibold text-text-primary">
                {plan.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-[32px] font-semibold text-text-primary">
                  ${plan.price}
                </span>
                <span className="font-sans text-[12.5px] font-light text-text-muted">
                  /month
                </span>
              </div>

              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {plan.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 font-sans text-[13px] font-light text-text-secondary"
                  >
                    <Check
                      className="mt-0.5 h-[15px] w-[15px] shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={onGetStarted}
                className={cn(
                  "mt-6 rounded-md px-5 py-2.5 font-sans text-[13px] font-semibold transition hover:-translate-y-0.5",
                  plan.highlighted
                    ? "bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
                    : "border border-primary/22 bg-primary/8 text-primary",
                )}
              >
                Get Started
              </button>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
