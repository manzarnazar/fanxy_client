"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface ScheduledCountdownProps {
  targetMs: number;
  /** Fired once when the countdown reaches zero — the backend has auto-published by then. */
  onExpired?: () => void;
}

function formatRemaining(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

export function ScheduledCountdown({ targetMs, onExpired }: ScheduledCountdownProps) {
  const [remaining, setRemaining] = useState(() => targetMs - Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = targetMs - Date.now();
      setRemaining(next);
      if (next <= 0) {
        window.clearInterval(timer);
        onExpired?.();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [targetMs, onExpired]);

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-sans text-[10.5px] font-semibold text-primary-light tabular-nums">
      <Clock className="h-3 w-3" aria-hidden="true" />
      {remaining <= 0 ? "Publishing…" : formatRemaining(remaining)}
    </span>
  );
}
