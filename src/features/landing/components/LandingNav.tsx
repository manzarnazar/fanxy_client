"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { AppLogo } from "@/components/shared/AppLogo";

interface LandingNavProps {
  onGetStarted: () => void;
}

export function LandingNav({ onGetStarted }: LandingNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6.5 py-4 transition-all",
        scrolled
          ? "border-b border-primary/14 bg-surface-elevated/85 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="flex items-center gap-2.5">
        <AppLogo size={34} />
        <span className="font-display text-[19px] font-semibold tracking-wide text-white">
          Fanxy
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onGetStarted}
          className="hidden rounded-md border border-white/20 bg-white/10 px-4 py-2 font-sans text-[12.5px] font-medium text-white transition hover:bg-white/16 sm:inline-flex"
        >
          Login
        </button>
        <button
          type="button"
          onClick={onGetStarted}
          className="rounded-md bg-gradient-to-br from-primary-light to-primary px-4 py-2 font-sans text-[12.5px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
