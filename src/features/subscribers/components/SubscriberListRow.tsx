import Image from "next/image";
import { ShieldOff, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { packageColorClassName } from "@/features/subscribers/constants/subscribers";
import { SubscriberContextMenu } from "@/features/subscribers/components/SubscriberContextMenu";
import type { Subscriber } from "@/features/subscribers/types/subscribers.types";

interface SubscriberListRowProps {
  subscriber: Subscriber;
  onOpen: () => void;
  onToggleBlock: () => void;
}

export function SubscriberListRow({ subscriber, onOpen, onToggleBlock }: SubscriberListRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && onOpen()}
      className="flex cursor-pointer items-center gap-3 rounded-xl border border-primary/14 bg-surface/50 px-3.5 py-2.5 transition hover:border-primary/30"
    >
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface-elevated">
        {subscriber.avatarUrl ? (
          <Image src={subscriber.avatarUrl} alt="" fill className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-text-secondary/60">
            <User className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-sans text-[13px] font-medium text-text-primary">{subscriber.name}</span>
          {subscriber.blocked && <ShieldOff className="h-3 w-3 shrink-0 text-danger" aria-hidden="true" />}
        </div>
        <div className="mt-0.5 font-sans text-[10.5px] font-light text-text-secondary/60">{subscriber.lastTransactionLabel}</div>
      </div>

      {subscriber.packageName && (
        <span className={cn("hidden shrink-0 rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold sm:inline", packageColorClassName(subscriber.packageName))}>
          {subscriber.packageName}
        </span>
      )}

      <span className="w-20 shrink-0 text-right font-sans text-[12.5px] font-semibold text-text-primary">${formatCount(subscriber.lifetimeSpend)}</span>

      <span
        className={cn(
          "hidden shrink-0 items-center gap-1 rounded-md px-2 py-1 font-sans text-[9px] font-semibold sm:flex",
          subscriber.status === "active" ? "bg-success/16 text-success" : "bg-danger/16 text-danger",
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", subscriber.status === "active" ? "bg-success" : "bg-danger")} aria-hidden="true" />
        {subscriber.status === "active" ? "Active" : "Expired"}
      </span>

      <SubscriberContextMenu subscriber={subscriber} onToggleBlock={onToggleBlock} />
    </div>
  );
}
