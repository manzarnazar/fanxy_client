"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";

const MESSAGES = ["Connecting Secure Gateway…", "Encrypting Transaction…", "Authorizing Payment…", "Please Wait…"];

export function CheckoutProcessingOverlay() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-background/85 backdrop-blur-md">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <Loader2 className="absolute h-20 w-20 animate-spin text-primary/40" aria-hidden="true" />
        <Lock className="h-7 w-7 text-primary-light" aria-hidden="true" />
      </div>
      <p className="mt-5 font-display text-lg font-semibold text-text-primary">{MESSAGES[messageIndex]}</p>
      <p className="mt-1 font-sans text-[12px] font-light text-text-secondary/70">
        Please don&apos;t close this window.
      </p>
    </div>
  );
}
