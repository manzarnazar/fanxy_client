"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GradientMesh } from "@/components/shared/GradientMesh";
import { SplashLogo } from "@/components/splash/SplashLogo";
import { SplashText } from "@/components/splash/SplashText";
import { SplashLoader } from "@/components/splash/SplashLoader";

const MIN_VISIBLE_MS = 1800;

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(onComplete, MIN_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 1.04, filter: "blur(8px)" }
      }
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_50%_-8%,#0b3f5c_0%,#07293f_34%,#041a29_62%,#020c14_100%)]"
    >
      <GradientMesh />
      <div className="relative z-[2] flex flex-col items-center">
        <SplashLogo />
        <SplashText />
        <div className="mt-7">
          <SplashLoader />
        </div>
      </div>
    </motion.div>
  );
}
