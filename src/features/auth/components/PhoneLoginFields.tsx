"use client";

import { Controller } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CountryPicker } from "@/features/auth/components/CountryPicker";
import type { usePhoneLogin } from "@/features/auth/hooks/usePhoneLogin";

interface PhoneLoginFieldsProps {
  phoneAuth: ReturnType<typeof usePhoneLogin>;
}

export function PhoneLoginFields({ phoneAuth }: PhoneLoginFieldsProps) {
  const { phoneForm, requestOtp, isSubmitting } = phoneAuth;
  const {
    register,
    control,
    formState: { errors },
  } = phoneForm;

  return (
    <form onSubmit={requestOtp} noValidate className="mt-[18px] flex flex-col gap-3.5">
      <div>
        <label className="mb-1.5 block px-1 font-sans text-[10px] font-medium tracking-wider text-text-muted uppercase">
          Mobile number
        </label>
        <div className="flex gap-2">
          <Controller
            control={control}
            name="dialCode"
            render={({ field }) => <CountryPicker value={field.value} onChange={field.onChange} />}
          />
          <div className="flex-1 rounded-md border border-border bg-surface/60 px-4 transition-colors focus-within:border-primary/60 focus-within:shadow-ring">
            <input
              type="tel"
              inputMode="numeric"
              placeholder="(555) 012 3489"
              autoComplete="tel-national"
              className="h-[52px] w-full bg-transparent font-sans text-[15px] text-text-primary outline-none placeholder:text-placeholder"
              {...register("phoneNumber")}
            />
          </div>
        </div>
        {errors.phoneNumber && (
          <p role="alert" className="mt-1.5 px-1 text-xs text-danger">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full">
        {isSubmitting ? (
          "Sending code…"
        ) : (
          <>
            Send Code
            <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}
