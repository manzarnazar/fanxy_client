"use client";

import { ArrowRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OtpInputGroup } from "@/components/ui/OtpInputGroup";
import type { usePhoneLogin } from "@/features/auth/hooks/usePhoneLogin";

interface OtpVerificationFieldsProps {
  phoneAuth: ReturnType<typeof usePhoneLogin>;
}

export function OtpVerificationFields({ phoneAuth }: OtpVerificationFieldsProps) {
  const { otpForm, verifyOtp, resendOtp, resendCooldown, changeNumber, isSubmitting, phoneForm } = phoneAuth;
  const code = otpForm.watch("code") ?? "";
  const { dialCode, phoneNumber } = phoneForm.getValues();

  return (
    <form onSubmit={verifyOtp} noValidate className="mt-[18px] flex flex-col gap-3.5">
      <p className="px-1 font-sans text-[13px] font-light text-text-secondary">
        Enter the 6-digit code sent to{" "}
        <span className="font-medium text-text-primary">
          {dialCode} {phoneNumber}
        </span>
      </p>

      <OtpInputGroup
        value={code}
        onChange={(next) => otpForm.setValue("code", next, { shouldValidate: true })}
        hasError={Boolean(otpForm.formState.errors.code)}
      />
      {otpForm.formState.errors.code && (
        <p role="alert" className="px-1 text-xs text-danger">
          {otpForm.formState.errors.code.message}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full">
        {isSubmitting ? (
          "Verifying…"
        ) : (
          <>
            Verify &amp; Sign In
            <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </>
        )}
      </Button>

      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={changeNumber}
          className="font-sans text-[13px] text-text-secondary transition hover:text-primary-light"
        >
          Change number
        </button>
        <button
          type="button"
          onClick={() => void resendOtp()}
          disabled={resendCooldown > 0}
          className="flex items-center gap-1.5 font-sans text-[13px] text-primary-light transition hover:underline disabled:cursor-not-allowed disabled:text-text-muted disabled:no-underline"
        >
          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}
