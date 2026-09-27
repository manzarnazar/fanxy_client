"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SplashLoader() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="flex items-center gap-1.5" role="status" aria-label="Loading">
        <span className="h-1.5 w-1.5 rounded-full bg-primary-light" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary-light/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary-light/40" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5" role="status" aria-label="Loading">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="h-1.5 w-1.5 rounded-full bg-primary-light"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
        />
      ))}
    </div>
  );
}
