"use client";

import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { submitCreatorInfo } from "@/store/slices/settingsSlice";
import { toast } from "@/lib/utils/toast";
import type { BecomeCreatorInput } from "@/features/settings/types/settings.types";

export type BecomeCreatorStep = "benefits" | "bank" | "identity" | "review" | "success";

export function useBecomeCreatorWizard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const saving = useAppSelector((state) => state.settings.savingCreatorInfo);

  const [step, setStep] = useState<BecomeCreatorStep>("benefits");
  const [form, setForm] = useState<BecomeCreatorInput>(() => ({
    bankName: user?.bankName ?? "",
    accountNo: user?.accountNo ?? "",
    ifscNo: user?.ifscNo ?? "",
    frontIdProofFile: null,
    backIdProofFile: null,
  }));
  const [termsAccepted, setTermsAccepted] = useState(false);

  const setField = useCallback(
    <TKey extends keyof BecomeCreatorInput>(key: TKey, value: BecomeCreatorInput[TKey]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const bankComplete =
    form.bankName.trim().length > 0 && form.accountNo.trim().length > 0 && form.ifscNo.trim().length > 0;

  const submit = useCallback(async () => {
    if (!bankComplete) {
      toast.warning("Please complete your bank details first.");
      setStep("bank");
      return;
    }
    if (!termsAccepted) {
      toast.warning("Please accept the terms to submit.");
      return;
    }
    try {
      await dispatch(submitCreatorInfo(form)).unwrap();
      setStep("success");
    } catch {
      toast.error("Failed to submit your application.");
    }
  }, [dispatch, form, bankComplete, termsAccepted]);

  return {
    user,
    step,
    setStep,
    form,
    setField,
    bankComplete,
    termsAccepted,
    setTermsAccepted,
    saving,
    submit,
  };
}
