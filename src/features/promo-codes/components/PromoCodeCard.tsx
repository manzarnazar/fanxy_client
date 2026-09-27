import Image from "next/image";
import { BadgePercent, Copy, Sparkles } from "lucide-react";
import { TiltCard } from "@/components/animations/TiltCard";
import { cn } from "@/lib/utils/cn";
import type { PromoCode } from "@/features/promo-codes/types/promo-codes.types";

interface PromoCodeCardProps {
  promo: PromoCode;
  onCopy: () => void;
}

export function PromoCodeCard({ promo, onCopy }: PromoCodeCardProps) {
  return (
    <TiltCard
      className={cn(
        "flex h-full flex-col rounded-[20px] border bg-surface/50 p-5",
        promo.active ? "border-primary/16 hover:border-primary/32" : "border-primary/10 opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-primary/12 text-primary-light">
          {promo.imageUrl ? (
            <Image src={promo.imageUrl} alt="" width={44} height={44} className="h-full w-full object-cover" />
          ) : (
            <BadgePercent className="h-5.5 w-5.5" aria-hidden="true" />
          )}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 font-sans text-[9.5px] font-bold tracking-wide uppercase",
            promo.active ? "bg-success/14 text-success" : "bg-text-secondary/14 text-text-secondary",
          )}
        >
          {promo.active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-3.5 font-display text-[26px] leading-none font-semibold text-text-primary">
        {promo.discountPercent}% OFF
      </div>
      <div className="mt-1 truncate font-sans text-[13px] font-medium text-text-primary">{promo.name}</div>

      {promo.newUsersOnly && (
        <span className="mt-2 flex w-fit items-center gap-1 rounded-full bg-secondary/14 px-2.5 py-0.5 font-sans text-[9.5px] font-bold tracking-wide text-secondary-light uppercase">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          New fans only
        </span>
      )}

      <button
        type="button"
        onClick={onCopy}
        className="mt-4 flex items-center justify-between gap-2 rounded-md border border-dashed border-primary/30 bg-surface-elevated/40 px-3.5 py-2.5 transition hover:border-primary/55 hover:bg-primary/8"
      >
        <span className="truncate font-mono text-[13.5px] font-semibold tracking-wider text-primary-light uppercase">
          {promo.code}
        </span>
        <Copy className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
      </button>
    </TiltCard>
  );
}
