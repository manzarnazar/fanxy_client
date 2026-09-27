"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { registerToastListener, type ToastItem, type ToastType } from "@/lib/utils/toast";

const TOAST_DURATION_MS = 5000;

const TOAST_ICON: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_ACCENT: Record<ToastType, string> = {
  success: "border-l-success text-success",
  error: "border-l-danger text-danger",
  warning: "border-l-warning text-warning",
  info: "border-l-info text-info",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    return registerToastListener((toastItem) => {
      setToasts((prev) => [...prev, toastItem]);
      window.setTimeout(() => dismiss(toastItem.id), TOAST_DURATION_MS);
    });
  }, [dismiss]);

  return (
    <>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        // Antivirus browser extensions (Bitdefender) stamp attributes on this
        // node before hydration — suppress that known-benign mismatch.
        suppressHydrationWarning
        className="pointer-events-none fixed top-4 right-4 left-4 z-100 flex flex-col gap-2 sm:left-auto sm:w-96"
      >
        {toasts.map((item) => {
          const Icon = TOAST_ICON[item.type];
          return (
            <div
              key={item.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-md border border-border border-l-4 bg-surface-elevated px-4 py-3 shadow-md",
                TOAST_ACCENT[item.type],
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="flex-1 text-sm font-medium text-text-primary">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="shrink-0 text-text-muted transition hover:text-text-primary"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
