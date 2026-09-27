"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { STORAGE_KEYS } from "@/lib/constants/keys";
import { ROUTES } from "@/lib/constants/routes";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { LandingPageContent } from "@/features/landing/components/LandingPageContent";

type GatePhase = "checking" | "splash" | "landing" | "done";

interface FirstVisitGateProps {
  children: React.ReactNode;
}

export function FirstVisitGate({ children }: FirstVisitGateProps) {
  const [phase, setPhase] = useState<GatePhase>("checking");
  const router = useRouter();

  useLayoutEffect(() => {
    // Reading localStorage (an external store) is only possible client-side, so the
    // phase must start as "checking" on both server and client and resolve here — the
    // synchronous setState-before-paint is what prevents a splash/landing flash on repeat visits.
    const hasVisited = window.localStorage.getItem(STORAGE_KEYS.HAS_VISITED) === "1";
    if (hasVisited) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.HAS_VISITED, "1");
    setPhase("splash");
  }, []);

  const handleSplashComplete = useCallback(() => setPhase("landing"), []);

  // Get Started drops guests straight onto the home feed — browsing is
  // public; interactions prompt sign-in via useAuthGuard.
  const handleGetStarted = useCallback(() => {
    router.push(ROUTES.HOME);
    setPhase("done");
  }, [router]);

  if (phase === "checking") return null;

  if (phase === "done") return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      {phase === "splash" && <SplashScreen key="splash" onComplete={handleSplashComplete} />}
      {phase === "landing" && <LandingPageContent key="landing" onGetStarted={handleGetStarted} />}
    </AnimatePresence>
  );
}
