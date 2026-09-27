"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

// Three.js only ever loads on capable desktop sessions — the dynamic import
// keeps it out of the main bundle entirely for everyone else.
const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), { ssr: false });

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeToViewport(listener: () => void): () => void {
  const mediaQuery = window.matchMedia(DESKTOP_QUERY);
  mediaQuery.addEventListener("change", listener);
  return () => mediaQuery.removeEventListener("change", listener);
}

function getCapableSnapshot(): boolean {
  const desktop = window.matchMedia(DESKTOP_QUERY).matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return desktop && (memory === undefined || memory >= 4);
}

/**
 * Gatekeeper for the 3D hero backdrop: renders nothing on mobile/tablet,
 * for reduced-motion users, or on low-memory devices.
 */
export function ThreeHero() {
  const reduceMotion = useReducedMotion();
  const enabled = useSyncExternalStore(subscribeToViewport, getCapableSnapshot, () => false);

  if (!enabled || reduceMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
      <HeroScene />
    </div>
  );
}
