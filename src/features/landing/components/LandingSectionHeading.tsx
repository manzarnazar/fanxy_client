"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface LandingSectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export function LandingSectionHeading({ eyebrow, title, description, className }: LandingSectionHeadingProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn("mx-auto flex max-w-[560px] flex-col items-center gap-3 text-center", className)}
    >
      <span className="rounded-full border border-primary/22 bg-primary/10 px-3.5 py-1 font-sans text-[11.5px] font-medium tracking-wide text-primary">
        {eyebrow}
      </span>
      <h2 className="font-display text-[30px] font-semibold text-text-primary sm:text-[36px]">{title}</h2>
      {description && (
        <p className="font-sans text-[14.5px] leading-relaxed font-light text-text-secondary">{description}</p>
      )}
    </motion.div>
  );
}
