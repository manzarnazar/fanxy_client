"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { GradientMesh } from "@/components/shared/GradientMesh";
import { ThreeHero } from "@/components/3d/ThreeHero";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingTrustStats } from "@/features/landing/components/LandingTrustStats";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_50%_-8%,#0b3f5c_0%,#07293f_34%,#041a29_62%,#020c14_100%)] pt-[152px] pb-24">
      <GradientMesh />
      <ThreeHero />
      <LandingNav onGetStarted={onGetStarted} />

      <div className="relative z-[2] mx-auto flex max-w-[860px] flex-col items-center px-6.5 text-center">
        <motion.span
          initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-full border border-white/16 bg-white/8 px-4 py-1.5 font-sans text-[12px] font-medium tracking-wide text-primary-light"
        >
          The creator subscription platform
        </motion.span>

        <motion.h1
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mt-6 font-display text-[40px] leading-[1.12] font-semibold text-white sm:text-[54px]"
        >
          Turn your passion into
          <br />
          a thriving community
        </motion.h1>

        <motion.p
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mt-5 max-w-[560px] font-sans text-[15.5px] leading-relaxed font-light text-white/70"
        >
          Share exclusive posts, reels, stories and live streams with your subscribers — and get paid every
          month for the content you already love creating.
        </motion.p>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={onGetStarted}
            className="group flex items-center gap-2 rounded-md bg-gradient-to-br from-primary-light to-primary px-6 py-3.5 font-sans text-[14.5px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            className="flex items-center gap-2 rounded-md border border-white/20 bg-white/8 px-6 py-3.5 font-sans text-[14.5px] font-medium text-white transition hover:bg-white/14"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            See How It Works
          </button>
        </motion.div>
      </div>

      <div className="relative z-[2] mt-16 px-6.5">
        <LandingTrustStats />
      </div>
    </section>
  );
}
