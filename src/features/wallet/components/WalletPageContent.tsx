"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock, Coins, Loader2, RefreshCw, Wallet } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWalletBundle } from "@/store/slices/walletSlice";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { selectCurrencySymbol } from "@/store/slices/appSettingsSlice";

export function WalletPageContent() {
  const dispatch = useAppDispatch();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const { coinPacks, transactions, truncated, status, error } = useAppSelector((state) => state.wallet);
  const currencySymbol = useAppSelector(selectCurrencySymbol);

  useEffect(() => {
    if (!user || status !== "idle") return;
    void dispatch(fetchWalletBundle());
  }, [dispatch, user, status]);

  if (!isBootstrapped) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[680px]">
          <SectionStateMessage
            variant="empty"
            title="Sign in to see your wallet"
            body="Your coins and purchase history live in your account."
            emptyHref={ROUTES.SIGN_IN}
            emptyLabel="Sign In"
          />
        </div>
      </main>
    );
  }

  const isLoading = status === "loading" || status === "idle";

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="mb-1.5 inline-block rounded-full border border-warning/24 bg-warning/10 px-3 py-0.5 font-sans text-[10.5px] font-medium tracking-wide text-warning">
              Personal Wallet
            </span>
            <h1 className="font-display text-[26px] leading-tight font-semibold text-text-primary">My Wallet</h1>
            <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
              Manage your coins and purchase history.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void dispatch(fetchWalletBundle())}
            disabled={isLoading}
            title="Refresh"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/12 hover:text-text-primary disabled:opacity-60"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} aria-hidden="true" />
          </button>
        </div>

        {/* Balance hero */}
        <div className="mb-5 overflow-hidden rounded-[20px] border border-warning/20 bg-[radial-gradient(130%_150%_at_20%_-20%,#3d2f10_0%,#0b2436_45%,#041a29_80%)] p-6">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="font-sans text-[11.5px] font-medium tracking-wide text-warning/90 uppercase">
                Current coin balance
              </div>
              <div className="mt-1 flex items-center gap-2.5">
                <Coins className="h-8 w-8 text-warning" aria-hidden="true" />
                <span className="font-display text-[42px] leading-none font-semibold text-white">
                  {user.coinBalance.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-1.5 font-display text-lg font-semibold text-white">
                  <Wallet className="h-4 w-4 text-primary-light" aria-hidden="true" />
                  {currencySymbol}
                  {formatCount(user.walletBalance)}
                </div>
                <div className="font-sans text-[10.5px] font-light text-white/55">Wallet balance</div>
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-white">{formatCount(user.earnedCoins)}</div>
                <div className="font-sans text-[10.5px] font-light text-white/55">Earned coins</div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4" aria-hidden="true">
            <div className="h-[180px] animate-pulse rounded-[20px] border border-primary/10 bg-surface/40" />
            <div className="h-[260px] animate-pulse rounded-[20px] border border-primary/10 bg-surface/40" />
          </div>
        ) : status === "failed" ? (
          <SectionStateMessage
            variant="error"
            title="Unable to load your wallet"
            body={error ?? "Something went wrong. Please try again."}
            onRetry={() => void dispatch(fetchWalletBundle())}
          />
        ) : (
          <>
            {/* Recharge packs */}
            {coinPacks.length > 0 && (
              <div className="mb-5">
                <div className="mb-3 font-sans text-[10px] font-semibold tracking-[0.8px] text-text-secondary/60 uppercase">
                  Recharge coins
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {coinPacks.map((pack) => (
                    <Link
                      key={pack.id}
                      href={ROUTES.CHECKOUT_COINS(pack.id)}
                      className="group flex flex-col items-center rounded-[16px] border border-warning/18 bg-surface/50 p-4 text-center transition hover:-translate-y-0.5 hover:border-warning/40"
                    >
                      {pack.imageUrl ? (
                        <Image src={pack.imageUrl} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
                      ) : (
                        <Coins className="h-9 w-9 text-warning" aria-hidden="true" />
                      )}
                      <div className="mt-2 font-display text-lg font-semibold text-text-primary">
                        {pack.coins.toLocaleString()}
                      </div>
                      <div className="font-sans text-[10.5px] font-light text-text-secondary/65">{pack.name}</div>
                      <span className="mt-2.5 flex items-center gap-1 rounded-full bg-gradient-to-br from-primary-light to-primary px-3 py-1 font-sans text-[11.5px] font-semibold text-[#03283a] transition group-hover:-translate-y-0.5">
                        {currencySymbol}{pack.price}
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase history */}
            <div className="mb-3 font-sans text-[10px] font-semibold tracking-[0.8px] text-text-secondary/60 uppercase">
              Coin purchases
            </div>
            {transactions.length === 0 ? (
              <SectionStateMessage
                variant="empty"
                icon={Coins}
                title="No coin purchases yet"
                body="Recharge coins to send gifts and support your favorite creators."
                minHeightClassName="min-h-[240px]"
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-3.5 rounded-xl border border-primary/14 bg-surface/50 p-3.5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-warning/12 text-warning">
                      <Coins className="h-[19px] w-[19px]" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-sans text-[13.5px] font-semibold text-text-primary">
                        +{transaction.coins.toLocaleString()} coins
                        {transaction.packName ? ` · ${transaction.packName}` : ""}
                      </div>
                      <div className="mt-0.5 truncate font-sans text-[11.5px] font-light text-text-secondary/70">
                        {[transaction.transactionId, transaction.description].filter(Boolean).join(" · ") ||
                          "Coin purchase"}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="font-sans text-[11px] font-light text-text-secondary/60">{transaction.dateLabel}</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold tracking-wide uppercase",
                          transaction.completed ? "bg-success/14 text-success" : "bg-warning/14 text-warning",
                        )}
                      >
                        {transaction.completed ? (
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <Clock className="h-3 w-3" aria-hidden="true" />
                        )}
                        {transaction.completed ? "Completed" : "Pending"}
                        {transaction.price !== null && ` · ${currencySymbol}${transaction.price}`}
                      </span>
                    </div>
                  </div>
                ))}
                {truncated && (
                  <p className="mt-1 text-center font-sans text-[11px] font-light text-text-secondary/60">
                    Showing the most recent purchases — older history isn&apos;t loaded.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
