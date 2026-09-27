"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TiltCard } from "@/components/animations/TiltCard";
import { FEATURES } from "@/features/landing/constants/landing";
import { LandingSectionHeading } from "@/features/landing/components/LandingSectionHeading";

export function LandingFeaturesGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-background px-6.5 py-20">
      <LandingSectionHeading
        eyebrow="Everything you need"
        title="Built for creators, made for fans"
        description="One platform for every way you want to connect with your audience and get paid for it."
      />

      <div className="mx-auto mt-12 grid max-w-[1080px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
          >
            <TiltCard className="h-full rounded-md border border-primary/12 bg-surface-elevated/60 p-6 transition-colors hover:border-primary/28">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-br from-primary-light to-primary text-[#03283a]">
                <feature.icon className="h-[20px] w-[20px]" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-sans text-[15.5px] font-semibold text-text-primary">{feature.title}</h3>
              <p className="mt-1.5 font-sans text-[13px] leading-relaxed font-light text-text-secondary">
                {feature.description}
              </p>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
