"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { signInWithGoogle } from "@/store/slices/authSlice";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "@/lib/utils/toast";
import { GOOGLE_ICON_SVG } from "@/features/auth/constants/social-icons";

interface GoogleSignInButtonProps {
  label?: string;
}

export function GoogleSignInButton({ label }: GoogleSignInButtonProps = {}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const result = await dispatch(signInWithGoogle());
    setIsLoading(false);

    if (signInWithGoogle.fulfilled.match(result)) {
      router.push(searchParams.get("next") ?? ROUTES.HOME);
      return;
    }
    if (result.payload?.isCancelled) return;
    toast.error(result.payload?.message || "Unable to sign in with Google.");
  };

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isLoading}
      aria-label="Continue with Google"
      className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface/60 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span dangerouslySetInnerHTML={{ __html: GOOGLE_ICON_SVG }} />
      {label && <span className="font-sans text-[12.5px] font-medium text-text-secondary">{label}</span>}
    </button>
  );
}
