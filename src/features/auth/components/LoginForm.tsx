"use client";

import { ShieldCheck } from "lucide-react";
import { SocialLoginButtons } from "@/features/auth/components/SocialLoginButtons";
import { LoginSuccessState } from "@/features/auth/components/LoginSuccessState";
import { LoginErrorState } from "@/features/auth/components/LoginErrorState";
import { PhoneLoginFields } from "@/features/auth/components/PhoneLoginFields";
import { OtpVerificationFields } from "@/features/auth/components/OtpVerificationFields";
import { RECAPTCHA_CONTAINER_ID, usePhoneLogin } from "@/features/auth/hooks/usePhoneLogin";
import { AppLogo } from "@/components/shared/AppLogo";

export function LoginForm() {
  const phoneAuth = usePhoneLogin();

  if (phoneAuth.status === "success") {
    return <LoginSuccessState />;
  }

  if (phoneAuth.status === "error") {
    return <LoginErrorState onRetry={phoneAuth.retry} />;
  }

  return (
    <div>
      <div className="flex items-center gap-2.5">
        {/* <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[radial-gradient(circle_at_35%_28%,#052436,#02101a)] shadow-[inset_0_0_0_1.5px_rgba(0,175,240,.7),0_0_22px_-6px_rgba(0,175,240,.6)]"> */}
        <AppLogo size={36} />
        {/* </span> */}
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5">
          <ShieldCheck className="h-[13px] w-[13px] text-success" aria-hidden="true" />
          <span className="text-[10.5px] font-medium tracking-wide text-success">Secure</span>
        </span>
      </div>

      <h2 className="mt-5 font-display text-[32px] leading-none font-semibold text-text-primary">
        Welcome Back
      </h2>
      <p className="mt-1.5 text-sm font-light text-text-secondary">
        Sign in to continue your premium experience.
      </p>

      {phoneAuth.step === "phone" && <PhoneLoginFields phoneAuth={phoneAuth} />}
      {phoneAuth.step === "otp" && <OtpVerificationFields phoneAuth={phoneAuth} />}

      <div className="my-[22px] flex items-center gap-3.5">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/35" />
        <span className="text-[10.5px] font-light tracking-[0.2em] text-text-muted uppercase">
          or continue with
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/35" />
      </div>

      <SocialLoginButtons />

      <div id={RECAPTCHA_CONTAINER_ID} />

      <div className="mt-[18px] flex items-center gap-2.5 rounded-md border border-primary/15 bg-surface/45 px-3.5 py-3">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
          <span className="absolute inset-0 animate-[glow_2.6s_ease-in-out_infinite] rounded-xs bg-[radial-gradient(circle,rgba(127,230,165,.3),transparent_68%)]" />
          <ShieldCheck className="relative h-[22px] w-[22px] text-success" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[12.5px] font-medium text-text-primary">
            256-bit encrypted &amp; secure login
          </p>
          <p className="text-[11px] font-light text-text-muted">
            Your privacy is protected · Members verified
          </p>
        </div>
      </div>
    </div>
  );
}
