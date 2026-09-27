"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { images } from "@/branding/image";

export function SplashLogo() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={
        reduceMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 1, scale: 1, y: [0, -6, 0] }
      }
      transition={
        reduceMotion
          ? { duration: 0.3, ease: "easeOut" }
          : {
              opacity: { duration: 0.4, ease: "easeOut" },
              scale: { duration: 0.4, ease: "easeOut" },
              y: {
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              },
            }
      }
      className="relative flex h-24 w-24 items-center justify-center"
    >
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-primary/35 blur-2xl"
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <Image
        src={images.logoMark}
        alt="yourappname"
        width={96}
        height={96}
        priority
        className="relative h-24 w-24 rounded-2xl object-contain"
      />
    </motion.div>
  );
}
