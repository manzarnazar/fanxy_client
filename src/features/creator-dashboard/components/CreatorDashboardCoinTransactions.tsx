import { Coins } from "lucide-react";
import type { CoinTransactionItem } from "@/features/creator-dashboard/types/creator-dashboard.types";

interface CreatorDashboardCoinTransactionsProps {
  transactions: CoinTransactionItem[];
}

export function CreatorDashboardCoinTransactions({ transactions }: CreatorDashboardCoinTransactionsProps) {
  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-5">
      <div className="mb-3.5 font-display text-lg font-semibold text-text-primary">Coin activity</div>

      {transactions.length === 0 ? (
        <div className="py-6 text-center font-sans text-[13px] font-light text-text-secondary/70">No coin activity yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary-light">
                <Coins className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-sans text-[13px] font-medium text-text-primary">{transaction.packageName ?? "Coin package"}</div>
                <div className="font-sans text-[11px] font-light text-text-secondary/65">{transaction.createdAtLabel}</div>
              </div>
              <div className="shrink-0 font-sans text-[13px] font-semibold text-primary-light">+{transaction.coin.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
