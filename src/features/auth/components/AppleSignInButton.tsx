"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { signInWithApple } from "@/store/slices/authSlice";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "@/lib/utils/toast";
import { APPLE_ICON_SVG } from "@/features/auth/constants/social-icons";

interface AppleSignInButtonProps {
  label?: string;
}

export function AppleSignInButton({ label }: AppleSignInButtonProps = {}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const result = await dispatch(signInWithApple());
    setIsLoading(false);

    if (signInWithApple.fulfilled.match(result)) {
      router.push(searchParams.get("next") ?? ROUTES.HOME);
      return;
    }
    if (result.payload?.isCancelled) return;
    toast.error(result.payload?.message || "Unable to sign in with Apple.");
  };

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isLoading}
      aria-label="Continue with Apple"
      className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface/60 text-text-primary backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span dangerouslySetInnerHTML={{ __html: APPLE_ICON_SVG }} />
      {label && <span className="font-sans text-[12.5px] font-medium text-text-secondary">{label}</span>}
    </button>
  );
}
