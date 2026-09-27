"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "@/lib/utils/toast";

/**
 * Guests can browse, but interactions need an account. Wrap any handler:
 * runs it when signed in, otherwise toasts and routes to sign-in (with a
 * `next` param back to the current page).
 */
export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const isSignedIn = useAppSelector((state) => state.auth.user !== null);

  const requireAuth = useCallback(
    (action: () => void, message = "Sign in to continue.") => {
      if (isSignedIn) {
        action();
        return;
      }
      toast.info(message);
      router.push(`${ROUTES.SIGN_IN}?next=${encodeURIComponent(pathname)}`);
    },
    [isSignedIn, router, pathname],
  );

  return { isSignedIn, requireAuth };
}
