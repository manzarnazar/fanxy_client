"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GradientMesh } from "@/components/shared/GradientMesh";

interface LandingFinalCtaProps {
  onGetStarted: () => void;
}

export function LandingFinalCta({ onGetStarted }: LandingFinalCtaProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_50%_110%,#0b3f5c_0%,#07293f_34%,#041a29_62%,#020c14_100%)] px-6.5 py-24">
      <GradientMesh />
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative z-[2] mx-auto flex max-w-[600px] flex-col items-center gap-5 text-center"
      >
        <h2 className="font-display text-[30px] font-semibold text-white sm:text-[36px]">
          Ready to build your community?
        </h2>
        <p className="font-sans text-[14.5px] leading-relaxed font-light text-white/70">
          Join thousands of creators already earning on yourappname. It only
          takes a minute to get started.
        </p>
        <button
          type="button"
          onClick={onGetStarted}
          className="group mt-2 flex items-center gap-2 rounded-md bg-gradient-to-br from-primary-light to-primary px-7 py-3.5 font-sans text-[14.5px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
        >
          Get Started Free
          <ArrowRight
            className="h-4 w-4 transition group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </motion.div>
    </section>
  );
}
