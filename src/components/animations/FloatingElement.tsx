"use client";

import { motion, useReducedMotion } from "framer-motion";

interface FloatingElementProps {
  children: React.ReactNode;
  /** Vertical drift amplitude in px. */
  amplitude?: number;
  durationSeconds?: number;
  delay?: number;
  className?: string;
}

/** Gentle perpetual float — for badges, icons, decorative shapes. */
export function FloatingElement({
  children,
  amplitude = 7,
  durationSeconds = 4,
  delay = 0,
  className,
}: FloatingElementProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration: durationSeconds, delay, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
