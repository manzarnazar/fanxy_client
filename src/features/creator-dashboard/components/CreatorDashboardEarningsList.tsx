import Image from "next/image";
import { User } from "lucide-react";
import type { EarningItem } from "@/features/creator-dashboard/types/creator-dashboard.types";

interface CreatorDashboardEarningsListProps {
  earnings: EarningItem[];
}

export function CreatorDashboardEarningsList({ earnings }: CreatorDashboardEarningsListProps) {
  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 p-5">
      <div className="mb-3.5 font-display text-lg font-semibold text-text-primary">Recent earnings</div>

      {earnings.length === 0 ? (
        <div className="py-6 text-center font-sans text-[13px] font-light text-text-secondary/70">No earnings yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {earnings.map((earning) => (
            <div key={earning.id} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/12 text-primary-light">
                {earning.buyerAvatarUrl ? (
                  <Image src={earning.buyerAvatarUrl} alt="" width={36} height={36} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-[18px] w-[18px]" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-sans text-[13px] font-medium text-text-primary">{earning.buyerName}</div>
                <div className="truncate font-sans text-[11px] font-light text-text-secondary/65">
                  {earning.packageName ?? "Package"} · {earning.createdAtLabel}
                </div>
              </div>
              <div className="shrink-0 font-sans text-[13px] font-semibold text-success">+{earning.price.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
