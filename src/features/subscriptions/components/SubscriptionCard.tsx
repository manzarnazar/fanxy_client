import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Crown, RefreshCw, User } from "lucide-react";
import { TiltCard } from "@/components/animations/TiltCard";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import type { Subscription } from "@/features/subscriptions/types/subscriptions.types";

const EXPIRING_SOON_DAYS = 7;

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const expiringSoon =
    subscription.active && subscription.daysLeft !== null && subscription.daysLeft <= EXPIRING_SOON_DAYS;

  const statusLabel = !subscription.active ? "Expired" : expiringSoon ? "Expiring Soon" : "Active";

  return (
    <TiltCard
      maxTilt={5}
      className="flex h-full flex-col overflow-hidden rounded-[20px] border border-primary/14 bg-surface/50 transition-colors hover:border-primary/28"
    >
      {/* Cover strip — the row only carries an avatar, so a branded gradient stands in for the mock's cover photo. */}
      <div className="relative h-[76px] bg-[radial-gradient(140%_180%_at_18%_-30%,#0b3f5c_0%,#07293f_50%,#041a29_85%)]">
        <div className="pointer-events-none absolute -top-6 -left-4 h-24 w-24 rounded-full bg-primary/18 blur-2xl" />
        <div className="pointer-events-none absolute -right-3 -bottom-8 h-24 w-24 rounded-full bg-secondary/12 blur-2xl" />
        <span
          className={cn(
            "absolute top-2.5 right-2.5 rounded-full px-2.5 py-0.5 font-sans text-[9.5px] font-bold tracking-wide uppercase backdrop-blur-sm",
            !subscription.active
              ? "bg-danger/24 text-[#ff9caa]"
              : expiringSoon
                ? "bg-warning/24 text-warning"
                : "bg-success/24 text-success",
          )}
        >
          {statusLabel}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-surface/95" />
      </div>

      <div className="-mt-8 flex flex-col px-4 pb-4">
        <div className="flex items-end justify-between">
          <div className=" relative z-10  h-[62px] w-[62px] rounded-full bg-gradient-to-br from-primary-light to-primary p-0.5">
            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
              {subscription.creatorAvatarUrl ? (
                <Image src={subscription.creatorAvatarUrl} alt="" width={58} height={58} className="h-full w-full object-cover" />
              ) : (
                <User className="h-6 w-6 text-text-secondary/60" aria-hidden="true" />
              )}
            </span>
          </div>
          <div className="pb-1 text-right">
            <span className="font-display text-[22px] leading-none font-semibold text-text-primary">
              ${subscription.price}
            </span>
          </div>
        </div>

        <div className="mt-2 truncate font-sans text-[14.5px] font-semibold text-text-primary">
          {subscription.creatorName}
        </div>
        <span className="mt-1.5 flex w-fit items-center gap-1 rounded-full bg-accent-gold/14 px-2.5 py-0.5 font-sans text-[10px] font-bold tracking-wide text-accent-gold-light uppercase">
          <Crown className="h-3 w-3" aria-hidden="true" />
          {subscription.packageName}
        </span>

        <div className="mt-3 flex items-center justify-between border-t border-primary/10 pt-2.5 font-sans text-[11.5px] font-light text-text-secondary/70">
          <span className="flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
            {subscription.active ? "Renewal" : "Ended"} {subscription.expiryLabel ?? "—"}
          </span>
          {subscription.active && subscription.daysLeft !== null && (
            <span className={cn("font-medium", expiringSoon ? "text-warning" : "text-text-secondary")}>
              {subscription.daysLeft} {subscription.daysLeft === 1 ? "day" : "days"} left
            </span>
          )}
        </div>

        {!subscription.active && (
          <Link
            href={ROUTES.CHECKOUT_SUBSCRIPTION(subscription.creatorId, subscription.packageId)}
            className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark px-4 py-2.5 font-sans text-[13px] font-semibold text-white transition hover:-translate-y-0.5"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Renew
          </Link>
        )}
      </div>
    </TiltCard>
  );
}
