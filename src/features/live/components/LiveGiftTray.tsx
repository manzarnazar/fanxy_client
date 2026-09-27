"use client";

import Image from "next/image";
import Link from "next/link";
import { Coins, Gift, Loader2, X } from "lucide-react";
import { formatCount } from "@/lib/formatter/count";
import { ROUTES } from "@/lib/constants/routes";
import type { LiveGift } from "@/features/live/types/live.types";

interface LiveGiftTrayProps {
  open: boolean;
  gifts: LiveGift[];
  coinBalance: number | null;
  sending: boolean;
  onSend: (gift: LiveGift) => void;
  onClose: () => void;
}

export function LiveGiftTray({ open, gifts, coinBalance, sending, onSend, onClose }: LiveGiftTrayProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Send a gift"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-t-2xl border border-primary/16 bg-surface-elevated p-5 shadow-card sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text-primary">
            <Gift className="h-4.5 w-4.5 text-primary-light" aria-hidden="true" />
            Send a gift
          </h2>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-3 py-1 font-sans text-[12px] font-semibold text-accent-gold">
              <Coins className="h-3.5 w-3.5" aria-hidden="true" />
              {coinBalance === null ? "—" : formatCount(coinBalance)}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-primary/10 hover:text-text-primary"
            >
              <X className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {gifts.length === 0 ? (
          <p className="py-8 text-center font-sans text-[13px] font-light text-text-secondary">
            No gifts are available right now.
          </p>
        ) : (
          <div className="mt-4 grid max-h-[46vh] grid-cols-3 gap-2.5 overflow-y-auto sm:grid-cols-4">
            {gifts.map((gift) => (
              <button
                key={gift.id}
                type="button"
                disabled={sending}
                onClick={() => onSend(gift)}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-primary/13 bg-surface/60 p-3 transition hover:-translate-y-0.5 hover:border-primary/35 disabled:opacity-50"
              >
                <span className="relative flex h-12 w-12 items-center justify-center">
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary-light" aria-hidden="true" />
                  ) : gift.imageUrl && !gift.imageUrl.endsWith(".svga") ? (
                    <Image src={gift.imageUrl} alt="" fill sizes="48px" className="object-contain" />
                  ) : (
                    <Gift className="h-7 w-7 text-primary-light" aria-hidden="true" />
                  )}
                </span>
                <span className="line-clamp-1 font-sans text-[11px] font-medium text-text-primary">{gift.name}</span>
                <span className="flex items-center gap-1 font-sans text-[10.5px] font-semibold text-accent-gold">
                  <Coins className="h-3 w-3" aria-hidden="true" />
                  {gift.coin === 0 ? "Free" : formatCount(gift.coin)}
                </span>
              </button>
            ))}
          </div>
        )}

        <Link
          href={ROUTES.WALLET}
          className="mt-4 block rounded-md border border-accent-gold/30 bg-accent-gold/8 py-2.5 text-center font-sans text-[12px] font-semibold text-accent-gold transition-colors hover:bg-accent-gold/14"
        >
          Recharge coins
        </Link>
      </div>
    </div>
  );
}
