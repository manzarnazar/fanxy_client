"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LOADING_MESSAGES = ["Loading…", "Preparing your feed…", "Almost ready…"];
const MESSAGE_INTERVAL_MS = 700;

export function SplashText() {
  const reduceMotion = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((prev) =>
        Math.min(prev + 1, LOADING_MESSAGES.length - 1),
      );
    }, MESSAGE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mt-5 flex flex-col items-center">
      <motion.span
        initial={{ opacity: 0, y: 10, letterSpacing: "0.15em" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        className="bg-gradient-to-b from-white to-primary-light bg-clip-text font-display text-[26px] font-semibold text-transparent"
      >
        Fanxy
      </motion.span>

      <div className="mt-3 h-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={messageIndex}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="block font-sans text-[12.5px] font-light text-text-secondary/75"
          >
            {LOADING_MESSAGES[messageIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
