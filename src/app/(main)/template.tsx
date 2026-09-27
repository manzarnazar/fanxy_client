"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Re-mounts on every route change inside (main), giving each page a soft
 * fade+rise entrance without touching routing or page code.
 */
export default function MainTemplate({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 0.65, 0.3, 0.9] }}
      className="flex min-h-0 w-full min-w-0 flex-1"
    >
      {children}
    </motion.div>
  );
}
