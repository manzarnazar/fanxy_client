"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AtSign, BadgeCheck, Coins, Crown, Loader2, Mail, MapPin, Pencil, Phone, User, Wallet } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { formatCount } from "@/lib/formatter/count";
import { formatMonthYear } from "@/lib/formatter/monthYear";
import { ROUTES } from "@/lib/constants/routes";

export function ProfilePageContent() {
  const router = useRouter();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isBootstrapped && !user) {
      router.replace(ROUTES.SIGN_IN);
    }
  }, [isBootstrapped, user, router]);

  if (!isBootstrapped || !user) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  const infoRows = [
    { label: "Email", value: user.email, icon: Mail },
    { label: "Phone", value: user.phone || "—", icon: Phone },
    { label: "Country", value: user.countryName || "—", icon: MapPin },
    { label: "Member since", value: formatMonthYear(user.createdAt), icon: User },
  ];

  const socialLinks = [
    { label: "Instagram", url: user.instagramUrl },
    { label: "Facebook", url: user.facebookUrl },
    { label: "Twitter", url: user.twitterUrl },
    { label: "YouTube", url: user.youtubeUrl },
  ].filter((link) => link.url);

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
      <div className="mx-auto max-w-[720px]">
        <div className="overflow-hidden rounded-xl border border-primary/14 bg-surface/50">
          <div className="relative h-36 w-full">
            {user.coverImageUrl ? (
              <Image src={user.coverImageUrl} alt="" fill className="object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary-dark to-surface-elevated" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent" />

            <Link
              href={ROUTES.SETTINGS}
              className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-md bg-gradient-to-br from-primary-light to-primary px-3.5 py-2 font-sans text-[12px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Edit profile
            </Link>
          </div>

          <div className="px-5.5 pb-5.5">
            <div className="-mt-10 flex items-end gap-3.5">
              <div className="relative z-10 h-21 w-21 shrink-0 rounded-full bg-gradient-to-br from-primary-light to-primary p-1">
                <div className="h-full w-full overflow-hidden rounded-full border-4 border-surface bg-surface-elevated">
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt="" width={84} height={84} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-text-secondary/60">
                      <User className="h-8 w-8" aria-hidden="true" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="font-display text-[22px] font-semibold text-text-primary">{user.fullName}</span>
              {user.verified && <BadgeCheck className="h-[18px] w-[18px] text-primary" aria-hidden="true" />}
              {user.isCreator && (
                <span className="flex items-center gap-1 rounded-full border border-accent-gold/32 bg-accent-gold/14 px-2.5 py-1 font-sans text-[10px] font-semibold text-accent-gold-light">
                  <Crown className="h-3 w-3" aria-hidden="true" />
                  Creator
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 font-sans text-[13px] font-light text-text-secondary/70">
              <AtSign className="h-3 w-3" aria-hidden="true" />
              {user.username.replace(/^@/, "")}
            </div>
            {user.bio && <p className="mt-2.5 font-sans text-[13px] leading-relaxed text-text-secondary/85">{user.bio}</p>}

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-md border border-primary/10 bg-surface/40 p-3.5 text-center">
                <Wallet className="mx-auto h-4 w-4 text-primary-light" aria-hidden="true" />
                <div className="mt-1.5 font-display text-base font-semibold text-text-primary">${formatCount(user.walletBalance)}</div>
                <div className="font-sans text-[10px] font-light text-text-secondary/60">Wallet</div>
              </div>
              <div className="rounded-md border border-primary/10 bg-surface/40 p-3.5 text-center">
                <Coins className="mx-auto h-4 w-4 text-accent-gold-light" aria-hidden="true" />
                <div className="mt-1.5 font-display text-base font-semibold text-text-primary">{formatCount(user.coinBalance)}</div>
                <div className="font-sans text-[10px] font-light text-text-secondary/60">Coins</div>
              </div>
              {user.isCreator && (
                <div className="rounded-md border border-primary/10 bg-surface/40 p-3.5 text-center">
                  <Coins className="mx-auto h-4 w-4 text-success" aria-hidden="true" />
                  <div className="mt-1.5 font-display text-base font-semibold text-text-primary">{formatCount(user.earnedCoins)}</div>
                  <div className="font-sans text-[10px] font-light text-text-secondary/60">Earned</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4.5 rounded-xl border border-primary/14 bg-surface/50 px-5 py-1.5">
          {infoRows.map((row, index) => (
            <div
              key={row.label}
              className={
                index !== infoRows.length - 1
                  ? "flex items-center justify-between gap-3 border-b border-primary/8 py-3"
                  : "flex items-center justify-between gap-3 py-3"
              }
            >
              <span className="flex items-center gap-1.5 font-sans text-[12.5px] font-light text-text-secondary/70">
                <row.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {row.label}
              </span>
              <span className="font-sans text-[13px] font-medium text-text-primary">{row.value}</span>
            </div>
          ))}
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-4.5 flex flex-wrap gap-2.5">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-primary/18 bg-surface/60 px-3.5 py-1.5 font-sans text-[12px] font-medium text-text-secondary transition hover:bg-primary/10"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
