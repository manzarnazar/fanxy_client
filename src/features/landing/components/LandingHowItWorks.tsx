"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HOW_IT_WORKS_STEPS } from "@/features/landing/constants/landing";
import { LandingSectionHeading } from "@/features/landing/components/LandingSectionHeading";

export function LandingHowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-surface-elevated/40 px-6.5 py-20">
      <LandingSectionHeading eyebrow="How it works" title="Start earning in four simple steps" />

      <div className="mx-auto mt-12 grid max-w-[1000px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <motion.div
            key={step.step}
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/24 bg-primary/10 font-display text-[18px] font-semibold text-primary">
              {step.step}
            </span>
            <h3 className="font-sans text-[15px] font-semibold text-text-primary">{step.title}</h3>
            <p className="max-w-[220px] font-sans text-[12.5px] leading-relaxed font-light text-text-secondary">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
