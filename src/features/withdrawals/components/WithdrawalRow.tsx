import { CheckCircle2, Clock, Coins, Landmark } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Withdrawal } from "@/features/withdrawals/types/withdrawals.types";

interface WithdrawalRowProps {
  withdrawal: Withdrawal;
}

export function WithdrawalRow({ withdrawal }: WithdrawalRowProps) {
  const StatusIcon = withdrawal.approved ? CheckCircle2 : Clock;

  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-primary/14 bg-surface/50 p-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary-light">
        <Landmark className="h-[19px] w-[19px]" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Coins className="h-3.5 w-3.5 shrink-0 text-warning" aria-hidden="true" />
          <span className="font-display text-[17px] font-semibold text-text-primary">
            {withdrawal.amountCoins.toLocaleString()}
          </span>
          <span className="font-sans text-[11px] font-light text-text-secondary/60">coins</span>
        </div>
        <div className="mt-0.5 truncate font-sans text-[11.5px] font-light text-text-secondary/70">
          {[withdrawal.paymentType, withdrawal.paymentDetail].filter(Boolean).join(" · ") || "Payout request"}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="font-sans text-[11px] font-light text-text-secondary/60">{withdrawal.dateLabel}</span>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold tracking-wide uppercase",
            withdrawal.approved ? "bg-success/14 text-success" : "bg-warning/14 text-warning",
          )}
        >
          <StatusIcon className="h-3 w-3" aria-hidden="true" />
          {withdrawal.approved ? "Approved" : "Pending"}
        </span>
      </div>
    </div>
  );
}
