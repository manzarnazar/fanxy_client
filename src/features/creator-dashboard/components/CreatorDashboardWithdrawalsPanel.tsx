import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useWithdrawalForm } from "@/features/creator-dashboard/hooks/useWithdrawalForm";
import type { WithdrawalItem } from "@/features/creator-dashboard/types/creator-dashboard.types";

interface CreatorDashboardWithdrawalsPanelProps {
  withdrawals: WithdrawalItem[];
}

export function CreatorDashboardWithdrawalsPanel({ withdrawals }: CreatorDashboardWithdrawalsPanelProps) {
  const form = useWithdrawalForm();

  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-5">
      <div className="mb-3.5 font-display text-lg font-semibold text-text-primary">Withdrawals</div>

      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row">
        <input
          value={form.coin}
          onChange={(event) => form.setCoin(event.target.value)}
          type="number"
          min={0}
          placeholder="Coin amount"
          aria-label="Coin amount"
          className="w-full rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5 font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder sm:w-32"
        />
        <input
          value={form.paymentDetail}
          onChange={(event) => form.setPaymentDetail(event.target.value)}
          placeholder="Payment details (e.g. UPI ID or bank info)"
          aria-label="Payment details"
          className="w-full flex-1 rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5 font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
        />
        <button
          type="button"
          onClick={form.submit}
          disabled={form.submitting}
          className={cn(
            "flex shrink-0 items-center justify-center gap-1.5 rounded-md px-4 py-2.5 font-sans text-[13px] font-semibold transition",
            form.submitting
              ? "cursor-not-allowed bg-primary/30 text-[#03283a]/70"
              : "bg-gradient-to-br from-primary-light to-primary text-[#03283a] hover:-translate-y-0.5",
          )}
        >
          {form.submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Request
        </button>
      </div>

      {withdrawals.length === 0 ? (
        <div className="py-4 text-center font-sans text-[13px] font-light text-text-secondary/70">No withdrawal history yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="flex items-center justify-between gap-3 border-t border-primary/8 pt-3 first:border-0 first:pt-0">
              <div className="min-w-0">
                <div className="font-sans text-[13px] font-medium text-text-primary">{withdrawal.amount.toLocaleString()} coins</div>
                <div className="truncate font-sans text-[11px] font-light text-text-secondary/65">
                  {withdrawal.paymentType || "Withdrawal"} · {withdrawal.createdAtLabel}
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 font-sans text-[10.5px] font-medium",
                  withdrawal.approved ? "bg-success/12 text-success" : "bg-primary/12 text-primary-light",
                )}
              >
                {withdrawal.approved ? "Approved" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
