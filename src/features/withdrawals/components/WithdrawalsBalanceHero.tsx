import { Coins } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";

interface WithdrawalsBalanceHeroProps {
  coinBalance: number;
  earnedCoins: number;
  walletBalance: number;
  pendingCoins: number;
  approvedCoins: number;
}

export function WithdrawalsBalanceHero({
  coinBalance,
  earnedCoins,
  walletBalance,
  pendingCoins,
  approvedCoins,
}: WithdrawalsBalanceHeroProps) {
  const figures = [
    { key: "earned", label: "Earned coins", value: formatCount(earnedCoins) },
    { key: "wallet", label: "Wallet balance", value: `$${formatCount(walletBalance)}` },
    { key: "pending", label: "Pending requests", value: formatCount(pendingCoins) },
    { key: "approved", label: "Approved payouts", value: formatCount(approvedCoins) },
  ];

  return (
    <div className="mb-4.5 overflow-hidden rounded-[20px] border border-primary/20 bg-[radial-gradient(130%_150%_at_20%_-20%,#0b3f5c_0%,#07293f_45%,#041a29_80%)] p-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="font-sans text-[11.5px] font-medium tracking-wide text-primary-light/85 uppercase">
            Coin balance
          </div>
          <div className="mt-1 flex items-center gap-2.5">
            <Coins className="h-8 w-8 text-warning" aria-hidden="true" />
            <span className="font-display text-[42px] leading-none font-semibold text-white">
              {coinBalance.toLocaleString()}
            </span>
          </div>
          <p className="mt-2 font-sans text-[11.5px] font-light text-white/60">
            Withdrawal requests are reviewed by the platform before payout.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
          {figures.map((figure) => (
            <div key={figure.key}>
              <div className="font-display text-lg font-semibold text-white">{figure.value}</div>
              <div className="font-sans text-[10.5px] font-light text-white/55">{figure.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
