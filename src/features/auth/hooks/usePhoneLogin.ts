"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import type { ConfirmationResult } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthError, verifyPhoneOtp } from "@/store/slices/authSlice";
import { sendPhoneVerificationCode } from "@/features/auth/services/firebaseAuthService";
import {
  otpSchema,
  phoneSchema,
  type OtpFormValues,
  type PhoneFormValues,
} from "@/features/auth/validation/phone.validation";
import { COUNTRIES } from "@/features/auth/constants/countries";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "@/lib/utils/toast";

export type PhoneLoginStep = "phone" | "otp";
export type LoginViewStatus = "form" | "success" | "error";

export const RECAPTCHA_CONTAINER_ID = "recaptcha-container";

const REDIRECT_DELAY_MS = 1400;
const RESEND_COOLDOWN_SECONDS = 60;

function countryNameForDialCode(dialCode: string): string {
  return COUNTRIES.find((country) => country.dialCode === dialCode)?.name ?? "";
}

// ConfirmationResult is a non-serializable Firebase SDK object — it must
// stay in local component state, never in Redux (would fail the store's
// serializability check).
export function usePhoneLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVerifying = useAppSelector((state) => state.auth.isLoading);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [status, setStatus] = useState<LoginViewStatus>("form");
  const [step, setStep] = useState<PhoneLoginStep>("phone");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { dialCode: "+91", phoneNumber: "9898989898" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "123456" },
  });

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => setResendCooldown((seconds) => seconds - 1), 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const requestCode = async (values: PhoneFormValues) => {
    setIsSendingCode(true);
    try {
      const result = await sendPhoneVerificationCode(`${values.dialCode}${values.phoneNumber}`, RECAPTCHA_CONTAINER_ID);
      setConfirmationResult(result);
      return true;
    } catch (error: unknown) {
      const code = (error as { code?: string } | undefined)?.code;
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        toast.error("Unable to send verification code.");
      }
      return false;
    } finally {
      setIsSendingCode(false);
    }
  };

  const requestOtp = phoneForm.handleSubmit(async (values) => {
    const sent = await requestCode(values);
    if (sent) {
      setStep("otp");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    }
  });

  const resendOtp = async () => {
    if (resendCooldown > 0) return;
    const sent = await requestCode(phoneForm.getValues());
    if (sent) {
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      toast.info("Verification code resent.");
    }
  };

  const verifyOtp = otpForm.handleSubmit(async (values) => {
    if (!confirmationResult) {
      toast.error("Please request a new code.");
      return;
    }
    const { dialCode, phoneNumber } = phoneForm.getValues();
    const result = await dispatch(
      verifyPhoneOtp({ dialCode, phoneNumber, countryName: countryNameForDialCode(dialCode), code: values.code, confirmationResult }),
    );

    if (verifyPhoneOtp.fulfilled.match(result)) {
      setStatus("success");
      const destination = searchParams.get("next") ?? ROUTES.HOME;
      window.setTimeout(() => router.push(destination), REDIRECT_DELAY_MS);
      return;
    }

    if (result.payload?.isUnauthorized) {
      setStatus("error");
    } else if (!result.payload?.isCancelled) {
      toast.error(result.payload?.message || "Something went wrong. Please try again.");
    }
  });

  const changeNumber = () => {
    setStep("phone");
    setConfirmationResult(null);
    otpForm.reset();
  };

  const retry = () => {
    dispatch(clearAuthError());
    setStatus("form");
    setStep("phone");
    setConfirmationResult(null);
    otpForm.reset();
  };

  return {
    step,
    phoneForm,
    otpForm,
    requestOtp,
    verifyOtp,
    resendOtp,
    resendCooldown,
    changeNumber,
    status,
    isSubmitting: isSendingCode || isVerifying,
    retry,
  };
}
