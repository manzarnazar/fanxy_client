import { ArrowUpRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface WithdrawalsHeaderBarProps {
  refreshing: boolean;
  onRefresh: () => void;
  onNewWithdrawal: () => void;
}

export function WithdrawalsHeaderBar({ refreshing, onRefresh, onNewWithdrawal }: WithdrawalsHeaderBarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-display text-[26px] leading-tight font-semibold text-text-primary">Withdrawals</h1>
        <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
          Redeem your earned coins to your payout account.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          title="Refresh"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/12 hover:text-text-primary disabled:opacity-60"
        >
          <RefreshCw className={cn("h-[16px] w-[16px]", refreshing && "animate-spin")} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onNewWithdrawal}
          className="flex items-center gap-1.5 rounded-md bg-gradient-to-br from-primary-light to-primary px-4 py-2.5 font-sans text-[13px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
        >
          <ArrowUpRight className="h-[16px] w-[16px]" aria-hidden="true" />
          New withdrawal
        </button>
      </div>
    </div>
  );
}
