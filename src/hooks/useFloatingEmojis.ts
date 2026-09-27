"use client";

import { useCallback, useRef, useState } from "react";

const FLOAT_LIFETIME_MS = 3600;
const FLOAT_CAP = 16;

export interface FloatingEmoji {
  id: number;
  emoji: string;
  x: string;
  dx: string;
  rot: string;
  size: string;
  dur: string;
}

export function useFloatingEmojis() {
  const [floats, setFloats] = useState<FloatingEmoji[]>([]);
  const idRef = useRef(0);

  const spawnFloat = useCallback((emoji: string) => {
    const id = ++idRef.current;
    const float: FloatingEmoji = {
      id,
      emoji,
      x: `${(Math.random() * 26).toFixed(0)}px`,
      dx: `${(Math.random() * 60 - 30).toFixed(0)}px`,
      rot: `${(Math.random() * 50 - 25).toFixed(0)}deg`,
      size: `${(24 + Math.random() * 14).toFixed(0)}px`,
      dur: `${(2.6 + Math.random() * 0.8).toFixed(2)}s`,
    };
    setFloats((prev) => [...prev, float].slice(-FLOAT_CAP));
    window.setTimeout(() => {
      setFloats((prev) => prev.filter((item) => item.id !== id));
    }, FLOAT_LIFETIME_MS);
  }, []);

  return { floats, spawnFloat };
}
