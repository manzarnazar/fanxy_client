"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  /** Final display string, e.g. "50K+", "$4,286.50", "1,418" — the numeric part counts up, affixes stay. */
  value: string;
  durationSeconds?: number;
  className?: string;
}

const NUMBER_PATTERN = /([\d,]+(?:\.\d+)?)/;

/** Counts the numeric part of a stat up from 0 the first time it scrolls into view. */
export function AnimatedNumber({ value, durationSeconds = 1.4, className }: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || reduceMotion || !ref.current) return;
    const match = value.match(NUMBER_PATTERN);
    if (!match) return;

    const target = Number(match[1].replaceAll(",", ""));
    if (!Number.isFinite(target)) return;
    const decimals = match[1].includes(".") ? (match[1].split(".")[1]?.length ?? 0) : 0;
    const useGrouping = match[1].includes(",");
    const node = ref.current;

    const controls = animate(0, target, {
      duration: durationSeconds,
      ease: [0.16, 0.8, 0.3, 1],
      onUpdate: (latest) => {
        const formatted = latest.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          useGrouping,
        });
        node.textContent = value.replace(NUMBER_PATTERN, formatted);
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, durationSeconds]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
