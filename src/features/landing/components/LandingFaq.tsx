"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { FAQ_ITEMS } from "@/features/landing/constants/landing";
import { LandingSectionHeading } from "@/features/landing/components/LandingSectionHeading";

export function LandingFaq() {
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-surface-elevated/40 px-6.5 py-20">
      <LandingSectionHeading eyebrow="FAQ" title="Frequently asked questions" />

      <div className="mx-auto mt-10 flex max-w-[680px] flex-col gap-3">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className="overflow-hidden rounded-md border border-primary/12 bg-surface/60">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="font-sans text-[14px] font-medium text-text-primary">{item.question}</span>
                <ChevronDown
                  className={cn("h-[18px] w-[18px] shrink-0 text-primary transition-transform", isOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduceMotion ? { height: "auto" } : { height: 0, opacity: 0 }}
                    animate={reduceMotion ? { height: "auto" } : { height: "auto", opacity: 1 }}
                    exit={reduceMotion ? { height: "auto" } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 font-sans text-[13px] leading-relaxed font-light text-text-secondary">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
