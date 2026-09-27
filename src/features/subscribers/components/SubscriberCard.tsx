import Image from "next/image";
import { BadgeCheck, ShieldOff, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { packageColorClassName } from "@/features/subscribers/constants/subscribers";
import { SubscriberContextMenu } from "@/features/subscribers/components/SubscriberContextMenu";
import type { Subscriber } from "@/features/subscribers/types/subscribers.types";

interface SubscriberCardProps {
  subscriber: Subscriber;
  onOpen: () => void;
  onToggleBlock: () => void;
}

export function SubscriberCard({ subscriber, onOpen, onToggleBlock }: SubscriberCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && onOpen()}
      className="cursor-pointer overflow-hidden rounded-xl border border-primary/14 bg-surface/50 transition hover:border-primary/30"
    >
      <div className="flex items-center justify-between px-3.5 pt-3.5">
        <span
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-1 font-sans text-[9px] font-semibold",
            subscriber.status === "active" ? "bg-success/16 text-success" : "bg-danger/16 text-danger",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", subscriber.status === "active" ? "bg-success" : "bg-danger")} aria-hidden="true" />
          {subscriber.status === "active" ? "Active" : "Expired"}
        </span>
        {subscriber.blocked && (
          <span className="flex items-center gap-1 rounded-md bg-danger/16 px-2 py-1 font-sans text-[9px] font-semibold text-danger">
            <ShieldOff className="h-2.5 w-2.5" aria-hidden="true" />
            Blocked
          </span>
        )}
      </div>

      <div className="flex flex-col items-center px-4 pt-2.5 pb-4 text-center">
        <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-primary-light to-primary p-0.5">
          <div className="h-full w-full overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
            {subscriber.avatarUrl ? (
              <Image src={subscriber.avatarUrl} alt="" width={64} height={64} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-text-secondary/60">
                <User className="h-6 w-6" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1">
          <span className="truncate font-sans text-[13.5px] font-semibold text-text-primary">{subscriber.name}</span>
          <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        </div>

        {subscriber.packageName && (
          <span className={cn("mt-2 rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold", packageColorClassName(subscriber.packageName))}>
            {subscriber.packageName}
          </span>
        )}

        <div className="mt-2.5 font-sans text-[12px] font-semibold text-text-primary">${formatCount(subscriber.lifetimeSpend)}</div>
        <div className="font-sans text-[10.5px] font-light text-text-secondary/60">{subscriber.lastTransactionLabel}</div>
      </div>

      <div className="flex items-center justify-between border-t border-primary/8 px-3.5 py-2.5">
        <span className="font-sans text-[10.5px] font-light text-text-secondary/55">{subscriber.transactionCount} transactions</span>
        <SubscriberContextMenu subscriber={subscriber} onToggleBlock={onToggleBlock} />
      </div>
    </div>
  );
}
