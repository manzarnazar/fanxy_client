import { WALLET_STAT_DEFS } from "@/features/creator-dashboard/constants/creator-dashboard";
import type { WalletSnapshot } from "@/features/creator-dashboard/types/creator-dashboard.types";

interface CreatorDashboardWalletStatsProps {
  wallet: WalletSnapshot;
}

export function CreatorDashboardWalletStats({ wallet }: CreatorDashboardWalletStatsProps) {
  const values: Record<(typeof WALLET_STAT_DEFS)[number]["key"], number> = {
    wallet: wallet.walletBalance,
    coin: wallet.coinBalance,
    earned: wallet.earnedCoins,
  };

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
      {WALLET_STAT_DEFS.map((stat) => (
        <div key={stat.key} className="flex items-center gap-3.5 rounded-xl border border-primary/14 bg-surface/50 p-4.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary-light">
            <stat.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="font-sans text-[11px] font-light text-text-secondary/70">{stat.label}</div>
            <div className="font-display text-xl font-semibold text-text-primary">{values[stat.key].toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
