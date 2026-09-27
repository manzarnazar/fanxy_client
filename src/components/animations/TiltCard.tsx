"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface TiltCardProps {
  children: React.ReactNode;
  /** Max tilt in degrees — keep ≤8 for a premium, non-gimmicky feel. */
  maxTilt?: number;
  className?: string;
}

/**
 * Pointer-tracking 3D tilt with springy return and a soft glow that follows
 * the cursor. GPU-only transforms; inert under reduced motion and on touch.
 */
export function TiltCard({ children, maxTilt = 7, className }: TiltCardProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), { stiffness: 220, damping: 22 });
  const glowX = useTransform(px, [0, 1], ["20%", "80%"]);
  const glowY = useTransform(py, [0, 1], ["15%", "85%"]);

  if (reduceMotion) return <div className={className}>{children}</div>;

  const handlePointerMove = (event: React.PointerEvent) => {
    if (event.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={cn("group/tilt relative will-change-transform", className)}
    >
      <motion.div
        aria-hidden="true"
        style={{
          background: "radial-gradient(180px circle at var(--gx) var(--gy), rgba(0,175,240,.14), transparent 70%)",
          // @ts-expect-error CSS custom properties via motion styles
          "--gx": glowX,
          "--gy": glowY,
        }}
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
      />
      {children}
    </motion.div>
  );
}
