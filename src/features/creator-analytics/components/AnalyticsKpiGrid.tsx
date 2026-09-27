import { Activity, Eye, FolderOpen, Receipt, Repeat, UserPlus, Users, Wallet } from "lucide-react";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { formatCount } from "@/lib/formatter/count";
import type { AnalyticsSummary } from "@/features/creator-analytics/types/creator-analytics.types";

interface AnalyticsKpiGridProps {
  summary: AnalyticsSummary;
}

export function AnalyticsKpiGrid({ summary }: AnalyticsKpiGridProps) {
  const cards = [
    {
      key: "revenue",
      icon: Wallet,
      colorClassName: "bg-accent-gold/16 text-accent-gold-light",
      value: `$${formatCount(summary.totalRevenue)}`,
      label: "Revenue (range)",
    },
    {
      key: "transactions",
      icon: Receipt,
      colorClassName: "bg-primary/14 text-primary-light",
      value: formatCount(summary.transactionCount),
      label: "Transactions",
    },
    {
      key: "new-subscribers",
      icon: UserPlus,
      colorClassName: "bg-success/16 text-success",
      value: formatCount(summary.newSubscribers),
      label: "New subscribers",
    },
    {
      key: "renewals",
      icon: Repeat,
      colorClassName: "bg-secondary/14 text-secondary-light",
      value: formatCount(summary.renewals),
      label: "Renewals",
    },
    {
      key: "active",
      icon: Users,
      colorClassName: "bg-primary/14 text-primary-light",
      value: formatCount(summary.activeSubscribers),
      label: "Active subscribers",
    },
    {
      key: "posts",
      icon: FolderOpen,
      colorClassName: "bg-warning/16 text-warning",
      value: formatCount(summary.totalPosts),
      label: "Total posts",
    },
    {
      key: "views",
      icon: Eye,
      colorClassName: "bg-primary/14 text-primary-light",
      value: formatCount(summary.totalViews),
      label: "Post views",
    },
    {
      key: "engagement",
      icon: Activity,
      colorClassName: "bg-success/16 text-success",
      value: `${summary.engagementPercent}%`,
      label: "Engagement rate",
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
