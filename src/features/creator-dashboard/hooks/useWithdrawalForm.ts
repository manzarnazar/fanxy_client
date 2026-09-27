"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { requestWithdrawal } from "@/store/slices/creatorDashboardSlice";
import { toast } from "@/lib/utils/toast";

export function useWithdrawalForm() {
  const dispatch = useAppDispatch();
  const submitting = useAppSelector((state) => state.creatorDashboard.submittingWithdrawal);
  const [coin, setCoin] = useState("");
  const [paymentDetail, setPaymentDetail] = useState("");

  const canSubmit = Number(coin) > 0 && paymentDetail.trim().length > 0;

  const submit = async () => {
    if (!canSubmit) {
      toast.warning("Please complete all required fields.");
      return;
    }
    try {
      await dispatch(requestWithdrawal({ coin: Number(coin), paymentDetail })).unwrap();
      toast.success("Withdrawal request submitted successfully.");
      setCoin("");
      setPaymentDetail("");
    } catch {
      toast.error("Failed to submit withdrawal request.");
    }
  };

  return { coin, setCoin, paymentDetail, setPaymentDetail, canSubmit, submitting, submit: () => void submit() };
}
