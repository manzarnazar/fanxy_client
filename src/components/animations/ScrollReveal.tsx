"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Stagger offset in seconds — pass index * 0.08 for list items. */
  delay?: number;
  /** Slide distance in px; keep small for subtlety. */
  distance?: number;
  className?: string;
}

/** Fade+rise entrance when the element scrolls into view. Respects reduced motion. */
export function ScrollReveal({ children, delay = 0, distance = 22, className }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.65, 0.3, 0.9] }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
