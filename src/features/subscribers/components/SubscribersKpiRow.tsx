import { CheckCheck, Users, Wallet, XCircle } from "lucide-react";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { formatCount } from "@/lib/formatter/count";

interface SubscribersKpiRowProps {
  loadedCount: number;
  activeCount: number;
  expiredCount: number;
  revenueLoaded: number;
  hasMore: boolean;
}

export function SubscribersKpiRow({ loadedCount, activeCount, expiredCount, revenueLoaded, hasMore }: SubscribersKpiRowProps) {
  const cards = [
    {
      key: "total",
      icon: Users,
      colorClassName: "bg-primary/14 text-primary-light",
      value: formatCount(loadedCount),
      label: hasMore ? "Subscribers loaded" : "Subscribers",
    },
    {
      key: "active",
      icon: CheckCheck,
      colorClassName: "bg-success/16 text-success",
      value: formatCount(activeCount),
      label: "Active",
    },
    {
      key: "expired",
      icon: XCircle,
      colorClassName: "bg-danger/16 text-danger",
      value: formatCount(expiredCount),
      label: "Expired",
    },
    {
      key: "revenue",
      icon: Wallet,
      colorClassName: "bg-accent-gold/16 text-accent-gold-light",
      value: `$${formatCount(revenueLoaded)}`,
      label: hasMore ? "Revenue loaded" : "Total revenue",
    },
  ];

  return (
    <div className="mb-4.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.key} className="rounded-xl border border-primary/14 bg-surface/50 p-3.5">
          <span className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-md ${card.colorClassName}`}>
            <card.icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div className="font-display text-xl font-semibold text-text-primary"><AnimatedNumber value={card.value} /></div>
          <div className="mt-0.5 font-sans text-[11.5px] font-light text-text-secondary/70">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
