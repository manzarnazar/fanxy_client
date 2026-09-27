"use client";

import { useState } from "react";
import { Coins, Landmark, Loader2, X } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectMinWithdrawalCoin } from "@/store/slices/appSettingsSlice";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type { WithdrawalRequestInput } from "@/features/withdrawals/types/withdrawals.types";

interface WithdrawalRequestModalProps {
  open: boolean;
  user: AuthUser;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (input: WithdrawalRequestInput) => Promise<boolean>;
}

export function WithdrawalRequestModal({ open, user, submitting, onClose, onSubmit }: WithdrawalRequestModalProps) {
  const minWithdrawalCoin = useAppSelector(selectMinWithdrawalCoin);
  const [coinInput, setCoinInput] = useState("");
  const [paymentDetail, setPaymentDetail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!open) return null;

  const savedBankDetail = [user.bankName, user.accountNo, user.ifscNo].filter(Boolean).join(" · ");
  const coins = Number(coinInput);

  const handleSubmit = async () => {
    if (!Number.isFinite(coins) || coins <= 0) {
      setValidationError("Enter a valid coin amount.");
      return;
    }
    if (minWithdrawalCoin > 0 && coins < minWithdrawalCoin) {
      setValidationError(`Minimum withdrawal is ${minWithdrawalCoin.toLocaleString()} coins.`);
      return;
    }
    if (user.coinBalance > 0 && coins > user.coinBalance) {
      setValidationError("Amount exceeds your coin balance.");
      return;
    }
    if (paymentDetail.trim().length === 0) {
      setValidationError("Add your payout details (bank, UPI or PayPal).");
      return;
    }
    setValidationError(null);
    const submitted = await onSubmit({ coin: coins, paymentDetail: paymentDetail.trim() });
    if (submitted) {
      setCoinInput("");
      setPaymentDetail("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Request withdrawal"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[440px] rounded-xl border border-primary/24 bg-surface-elevated p-6 shadow-dropdown"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="font-display text-xl font-semibold text-text-primary">Request withdrawal</div>
            <div className="mt-0.5 font-sans text-[12px] font-light text-text-secondary/70">
              Redeem coins to your payout account.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/18 bg-surface/60 text-text-secondary transition hover:bg-primary/12"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-warning/20 bg-warning/8 px-4 py-3">
          <Coins className="h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
          <div className="font-sans text-[12.5px] text-text-secondary">
            Available balance:{" "}
            <span className="font-semibold text-text-primary">{user.coinBalance.toLocaleString()} coins</span>
          </div>
        </div>

        <label className="mb-1.5 block font-sans text-[11.5px] font-medium tracking-wide text-text-secondary/70 uppercase">
          Coin amount
        </label>
        <input
          value={coinInput}
          onChange={(event) => setCoinInput(event.target.value.replace(/[^0-9]/g, ""))}
          inputMode="numeric"
          placeholder="0"
          className="mb-4 h-12 w-full rounded-md border border-primary/16 bg-surface/70 px-3.5 font-sans text-[15px] text-text-primary placeholder:text-text-muted focus:border-primary/45 focus:outline-none"
        />

        <div className="mb-1.5 flex items-center justify-between">
          <label className="font-sans text-[11.5px] font-medium tracking-wide text-text-secondary/70 uppercase">
            Payout details
          </label>
          {savedBankDetail && (
            <button
              type="button"
              onClick={() => setPaymentDetail(savedBankDetail)}
              className="flex items-center gap-1 font-sans text-[11px] font-medium text-primary-light hover:underline"
            >
              <Landmark className="h-3 w-3" aria-hidden="true" />
              Use saved bank details
            </button>
          )}
        </div>
        <textarea
          value={paymentDetail}
          onChange={(event) => setPaymentDetail(event.target.value)}
          rows={3}
          placeholder="Bank account, UPI ID or PayPal email…"
          className="mb-1 w-full resize-none rounded-md border border-primary/16 bg-surface/70 px-3.5 py-2.5 font-sans text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary/45 focus:outline-none"
        />

        {validationError && <p className="mb-2 font-sans text-[12px] text-danger">{validationError}</p>}

        <button
          type="button"
          disabled={submitting}
          onClick={() => void handleSubmit()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-3 font-sans text-[14px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Submit request
        </button>
        <p className="mt-2.5 text-center font-sans text-[10.5px] font-light text-text-secondary/60">
          Requests are reviewed by the platform before payout.
        </p>
      </div>
    </div>
  );
}
