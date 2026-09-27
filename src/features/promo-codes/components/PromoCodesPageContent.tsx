"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BadgePercent, Info, Loader2, RefreshCw, Search, X } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { usePromoCodes } from "@/features/promo-codes/hooks/usePromoCodes";
import { PromoCodeCard } from "@/features/promo-codes/components/PromoCodeCard";

export function PromoCodesPageContent() {
  const router = useRouter();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const isCreator = user?.role === "creator";

  const feed = usePromoCodes();

  useEffect(() => {
    if (isBootstrapped && !isCreator) {
      router.replace(ROUTES.HOME);
    }
  }, [isBootstrapped, isCreator, router]);

  if (!isBootstrapped || !isCreator) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  const isLoading = feed.status === "loading" || feed.status === "idle";

  const kpis = [
    { key: "total", value: formatCount(feed.counts.all), label: "Promo codes" },
    { key: "new-users", value: formatCount(feed.counts.newUsers), label: "New-fan offers" },
    { key: "max", value: `${feed.maxDiscount}%`, label: "Best discount" },
    { key: "avg", value: `${feed.avgDiscount}%`, label: "Avg discount" },
  ];

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[960px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="mb-1.5 inline-block rounded-full border border-primary/22 bg-primary/10 px-3 py-0.5 font-sans text-[10.5px] font-medium tracking-wide text-primary-light">
              Marketing Center
            </span>
            <h1 className="font-display text-[26px] leading-tight font-semibold text-text-primary">Promo Codes</h1>
            <p className="mt-0.5 font-sans text-[12.5px] font-light text-text-secondary/75">
              Codes fans can apply at checkout on your subscription packages.
            </p>
          </div>
          <button
            type="button"
            onClick={feed.refresh}
            disabled={isLoading}
            title="Refresh"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/12 hover:text-text-primary disabled:opacity-60"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} aria-hidden="true" />
          </button>
        </div>

        <p className="mb-4.5 flex items-start gap-2 rounded-md border border-primary/14 bg-surface/40 px-3.5 py-2.5 font-sans text-[12px] font-light text-text-secondary">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
          Promo codes are created and managed by the platform team. Contact support to add or change a campaign —
          everything here is live from your account.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[200px] animate-pulse rounded-[20px] border border-primary/10 bg-surface/40" />
            ))}
          </div>
        ) : feed.status === "failed" ? (
          <SectionStateMessage
            variant="error"
            title="Unable to load promo codes"
            body={feed.error ?? "Something went wrong. Please try again."}
            onRetry={feed.refresh}
          />
        ) : !feed.hasAny ? (
          <SectionStateMessage
            variant="empty"
            icon={BadgePercent}
            title="No promo codes yet"
            body="When the platform team sets up promotional campaigns for your packages, they'll show up here."
            minHeightClassName="min-h-[320px]"
          />
        ) : (
          <>
            <div className="mb-4.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {kpis.map((kpi) => (
                <div key={kpi.key} className="rounded-xl border border-primary/14 bg-surface/50 p-3.5">
                  <div className="font-display text-xl font-semibold text-text-primary"><AnimatedNumber value={kpi.value} /></div>
                  <div className="mt-0.5 font-sans text-[11.5px] font-light text-text-secondary/70">{kpi.label}</div>
                </div>
              ))}
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <div className="flex rounded-md border border-primary/16 bg-surface/60 p-0.5">
                {(
                  [
                    { key: "all", label: `All · ${feed.counts.all}` },
                    { key: "new-users", label: `New fans · ${feed.counts.newUsers}` },
                  ] as const
                ).map((segment) => (
                  <button
                    key={segment.key}
                    type="button"
                    onClick={() => feed.setFilter(segment.key)}
                    className={cn(
                      "rounded-[5px] px-3.5 py-1.5 font-sans text-[12px] font-medium transition",
                      feed.filter === segment.key ? "bg-primary/16 text-primary-light" : "text-text-secondary hover:text-text-primary",
                    )}
                  >
                    {segment.label}
                  </button>
                ))}
              </div>

              <div className="flex h-10 min-w-[200px] flex-1 items-center gap-2 rounded-md border border-primary/16 bg-surface/60 px-3 focus-within:border-primary/45">
                <Search className="h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
                <input
                  value={feed.query}
                  onChange={(event) => feed.setQuery(event.target.value)}
                  placeholder="Search by code or campaign…"
                  aria-label="Search promo codes"
                  className="min-w-0 flex-1 bg-transparent font-sans text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                {feed.query.length > 0 && (
                  <button type="button" onClick={() => feed.setQuery("")} aria-label="Clear search" className="text-text-secondary">
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {feed.rows.length === 0 ? (
              <SectionStateMessage
                variant="empty"
                icon={BadgePercent}
                title="No matching promo codes"
                body="Try a different code or campaign name."
                minHeightClassName="min-h-[240px]"
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {feed.rows.map((promo) => (
                  <PromoCodeCard key={promo.id} promo={promo} onCopy={() => void feed.copyCode(promo)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
