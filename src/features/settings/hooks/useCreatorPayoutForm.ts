"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { submitCreatorInfo } from "@/store/slices/settingsSlice";
import { toast } from "@/lib/utils/toast";
import type { BecomeCreatorInput, SettingsProfile } from "@/features/settings/types/settings.types";

function buildInitialForm(profile: SettingsProfile): BecomeCreatorInput {
  return {
    bankName: profile.bankName ?? "",
    accountNo: profile.accountNo ?? "",
    ifscNo: profile.ifscNo ?? "",
    frontIdProofFile: null,
    backIdProofFile: null,
  };
}

export function useCreatorPayoutForm(profile: SettingsProfile) {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((state) => state.settings.savingCreatorInfo);
  const [form, setForm] = useState<BecomeCreatorInput>(() => buildInitialForm(profile));

  const setField = <TKey extends keyof BecomeCreatorInput>(key: TKey, value: BecomeCreatorInput[TKey]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = form.bankName.trim().length > 0 && form.accountNo.trim().length > 0 && form.ifscNo.trim().length > 0;

  const submit = async () => {
    if (!canSubmit) {
      toast.warning("Please complete all required fields.");
      return;
    }
    try {
      await dispatch(submitCreatorInfo(form)).unwrap();
      toast.success(profile.isCreator ? "Payout details updated successfully." : "Creator application submitted successfully.");
      setForm({ ...form, frontIdProofFile: null, backIdProofFile: null });
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  return { form, setField, canSubmit, saving, submit: () => void submit() };
}
