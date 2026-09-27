import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MessageCircle, ShieldOff, User, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { ROUTES } from "@/lib/constants/routes";
import { packageColorClassName } from "@/features/subscribers/constants/subscribers";
import type { Subscriber } from "@/features/subscribers/types/subscribers.types";

interface SubscriberDetailPanelProps {
  subscriber: Subscriber | null;
  onClose: () => void;
  onToggleBlock: (subscriber: Subscriber) => void;
}

export function SubscriberDetailPanel({ subscriber, onClose, onToggleBlock }: SubscriberDetailPanelProps) {
  if (!subscriber) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-end bg-black/55 backdrop-blur-[2px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={subscriber.name}
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-[420px] flex-col overflow-y-auto border-l border-primary/18 bg-surface-elevated"
      >
        <div className="flex items-center justify-between border-b border-primary/10 px-5.5 py-4">
          <div className="font-display text-lg font-semibold text-text-primary">Subscriber</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-md border border-primary/20 bg-surface/70 text-primary-light transition hover:bg-primary/12"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-5.5 py-5.5">
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 shrink-0 rounded-full bg-gradient-to-br from-primary-light to-primary p-1">
              <div className="h-full w-full overflow-hidden rounded-full border-4 border-surface bg-surface-elevated">
                {subscriber.avatarUrl ? (
                  <Image src={subscriber.avatarUrl} alt="" width={80} height={80} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-text-secondary/60">
                    <User className="h-8 w-8" aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="font-display text-lg font-semibold text-text-primary">{subscriber.name}</span>
              <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              {subscriber.blocked && (
                <span className="flex items-center gap-1 rounded-full bg-danger/16 px-2 py-1 font-sans text-[9px] font-semibold text-danger">
                  <ShieldOff className="h-2.5 w-2.5" aria-hidden="true" />
                  Blocked
                </span>
              )}
            </div>

            <div className="mt-4 flex w-full gap-2.5">
              <Link
                href={ROUTES.MESSAGES}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-gradient-to-br from-primary-light to-primary px-3.5 py-2.5 font-sans text-[12.5px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Message
              </Link>
              <Link
                href={ROUTES.CREATOR_PROFILE(subscriber.userId)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-primary/20 bg-surface/60 px-3.5 py-2.5 font-sans text-[12.5px] font-medium text-text-secondary transition hover:bg-primary/10"
              >
                <User className="h-3.5 w-3.5" aria-hidden="true" />
                View profile
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-primary/14 bg-surface/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-sans text-[12.5px] font-medium text-text-primary">Subscription</span>
              <span
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 font-sans text-[9px] font-semibold",
                  subscriber.status === "active" ? "bg-success/16 text-success" : "bg-danger/16 text-danger",
                )}
              >
                {subscriber.status === "active" ? "Active" : "Expired"}
              </span>
            </div>
            {subscriber.packageName && (
              <span className={cn("inline-flex rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold", packageColorClassName(subscriber.packageName))}>
                {subscriber.packageName}
              </span>
            )}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="font-sans text-[10px] font-medium tracking-wide text-text-muted uppercase">Lifetime spend</div>
                <div className="mt-0.5 font-display text-base font-semibold text-text-primary">${formatCount(subscriber.lifetimeSpend)}</div>
              </div>
              <div>
                <div className="font-sans text-[10px] font-medium tracking-wide text-text-muted uppercase">Transactions</div>
                <div className="mt-0.5 font-display text-base font-semibold text-text-primary">{subscriber.transactionCount}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 font-sans text-[12.5px] font-medium text-text-primary">Transaction history</div>
            <div className="flex flex-col gap-2.5">
              {subscriber.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-md border border-primary/10 bg-surface/40 px-3.5 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate font-sans text-[12px] font-medium text-text-primary">{transaction.packageName ?? "Package"}</div>
                    <div className="font-sans text-[10.5px] font-light text-text-secondary/60">{transaction.dateLabel}</div>
                  </div>
                  <span className="shrink-0 font-sans text-[12.5px] font-semibold text-success">${formatCount(transaction.price)}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleBlock(subscriber)}
            className="flex items-center justify-center gap-2 rounded-md border border-danger/28 bg-danger/10 py-3 font-sans text-[12.5px] font-semibold text-danger transition hover:bg-danger/18"
          >
            <ShieldOff className="h-4 w-4" aria-hidden="true" />
            {subscriber.blocked ? "Unblock subscriber" : "Block subscriber"}
          </button>
        </div>
      </div>
    </div>
  );
}
