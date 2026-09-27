import Image from "next/image";
import { CalendarClock, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import type { Subscription } from "@/features/subscriptions/types/subscriptions.types";

const RANK_COLOR_CLASSNAMES = ["text-accent-gold-light", "text-[#cfeaf8]", "text-[#e0a06a]"];

interface SubscriptionsRightRailProps {
  counts: { active: number; expiring: number };
  monthSpend: number;
  favoriteCreator: string | null;
  topCreators: Array<{ name: string; avatarUrl: string | null; total: number }>;
  upcomingRenewals: Subscription[];
  recentActivity: Subscription[];
}

export function SubscriptionsRightRail({
  counts,
  monthSpend,
  favoriteCreator,
  topCreators,
  upcomingRenewals,
  recentActivity,
}: SubscriptionsRightRailProps) {
  const summaryRows = [
    { label: "Active", value: formatCount(counts.active) },
    { label: "Renewing soon", value: formatCount(counts.expiring) },
    { label: "Spent this month", value: `$${formatCount(monthSpend)}` },
    ...(favoriteCreator ? [{ label: "Favorite creator", value: favoriteCreator }] : []),
  ];

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col gap-4 xl:flex">
      <div className="rounded-[18px] border border-primary/14 bg-surface/50 p-4">
        <div className="mb-3 font-display text-[15px] font-semibold text-text-primary">Subscription Summary</div>
        <div className="flex flex-col gap-2 font-sans text-[12.5px]">
          {summaryRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3">
              <span className="text-text-secondary/70">{row.label}</span>
              <span className="truncate font-medium text-text-primary">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {upcomingRenewals.length > 0 && (
        <div className="rounded-[18px] border border-primary/14 bg-surface/50 p-4">
          <div className="mb-3 font-display text-[15px] font-semibold text-text-primary">Upcoming renewals</div>
          <div className="flex flex-col gap-2.5">
            {upcomingRenewals.map((subscription) => (
              <div key={subscription.id} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-surface-elevated">
                  {subscription.creatorAvatarUrl ? (
                    <Image src={subscription.creatorAvatarUrl} alt="" width={36} height={36} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-text-secondary/60" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-sans text-[12.5px] font-medium text-text-primary">
                    {subscription.creatorName}
                  </div>
                  <div className="font-sans text-[10.5px] font-light text-text-secondary/65">
                    {subscription.daysLeft === 0
                      ? "Expires today"
                      : `Renews in ${subscription.daysLeft} ${subscription.daysLeft === 1 ? "day" : "days"}`}
                  </div>
                </div>
                <span className="shrink-0 font-sans text-[11.5px] font-semibold text-text-primary">
                  ${subscription.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topCreators.length > 0 && (
        <div className="rounded-[18px] border border-primary/14 bg-surface/50 p-4">
          <div className="mb-3 font-display text-[15px] font-semibold text-text-primary">Top Creators</div>
          <div className="flex flex-col gap-2.5">
            {topCreators.map((creator, index) => (
              <div key={creator.name + index} className="flex items-center gap-2.5">
                <span className={cn("w-4 shrink-0 font-display text-sm font-semibold", RANK_COLOR_CLASSNAMES[index] ?? "text-text-secondary/50")}>
                  {index + 1}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-surface-elevated">
                  {creator.avatarUrl ? (
                    <Image src={creator.avatarUrl} alt="" width={32} height={32} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-text-secondary/60" aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate font-sans text-[12.5px] font-medium text-text-primary">
                  {creator.name}
                </span>
                <span className="shrink-0 font-sans text-[11.5px] font-semibold text-success">
                  ${formatCount(creator.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentActivity.length > 0 && (
        <div className="rounded-[18px] border border-primary/14 bg-surface/50 p-4">
          <div className="mb-3 font-display text-[15px] font-semibold text-text-primary">Recent Activity</div>
          <div className="flex flex-col gap-2.5">
            {recentActivity.map((subscription) => (
              <div key={subscription.id} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary-light">
                  <CalendarClock className="h-3 w-3" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-sans text-[12px] font-medium text-text-primary">
                    Subscribed to {subscription.packageName}
                  </div>
                  <div className="font-sans text-[10.5px] font-light text-text-secondary/65">
                    {subscription.creatorName} · {subscription.startedLabel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
