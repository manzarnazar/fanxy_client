"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Coins, Crown, Search, User } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectAppLogoUrl, selectAppName } from "@/store/slices/appSettingsSlice";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { ROUTES } from "@/lib/constants/routes";
import { PRIMARY_NAV_ITEMS } from "@/lib/constants/nav";
import { AppLogo } from "@/components/shared/AppLogo";
import type { AuthUser } from "@/features/auth/types/auth.types";

interface HeaderProps {
  user: AuthUser | null;
  coinBalance: number | null;
  unreadMessageCount: number;
  unreadNotificationCount: number;
  onOpenSearch: () => void;
  searchPlaceholder?: string;
}

export function Header({
  user,
  coinBalance,
  unreadMessageCount,
  unreadNotificationCount,
  onOpenSearch,
  searchPlaceholder = "Search creators, posts, tags…",
}: HeaderProps) {
  const pathname = usePathname();
  const isCreator = user?.role === "creator";
  const appName = useAppSelector(selectAppName);
  const appLogoUrl = useAppSelector(selectAppLogoUrl);

  const isNavItemActive = (href: string) => (href === ROUTES.HOME ? pathname === ROUTES.HOME : pathname.startsWith(href));

  return (
    <header className="relative z-50 flex h-[66px] shrink-0 items-center gap-5 border-b border-primary/14 bg-surface-elevated/82 px-6.5 backdrop-blur-xl">
      <Link href={ROUTES.HOME} className="flex shrink-0 items-center gap-2.5">
        <AppLogo size={36} src={appLogoUrl} />
        <span className="hidden font-display text-[21px] font-semibold tracking-wide text-text-primary sm:inline">
          {appName}
        </span>
      </Link>

      <button
        type="button"
        onClick={onOpenSearch}
        className="hidden h-[42px] max-w-[360px] flex-1 items-center gap-2.5 rounded-md border border-primary/16 bg-surface/60 px-4 transition hover:border-primary/40 md:flex"
      >
        <Search className="h-[17px] w-[17px] text-primary-light" aria-hidden="true" />
        <span className="flex-1 truncate text-left font-sans text-[13.5px] font-light text-text-muted">
          {searchPlaceholder}
        </span>
        <span className="rounded-sm border border-primary/18 bg-primary/10 px-2 py-0.5 font-sans text-[10px] font-medium text-primary-light">
          ⌘K
        </span>
      </button>

      <nav className="flex flex-1 items-center justify-center gap-1">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(item.href);
          const Icon = item.icon;
          const badge = item.href === ROUTES.MESSAGES ? unreadMessageCount : 0;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative hidden items-center gap-1.5 rounded-md px-3.5 py-2.5 font-sans text-[13px] font-medium transition hover:bg-primary/10 hover:text-text-primary lg:flex",
                "after:absolute after:right-3.5 after:bottom-1 after:left-3.5 after:h-[2px] after:origin-left after:rounded-full after:bg-gradient-to-r after:from-primary-light after:to-primary after:transition-transform after:duration-300",
                isActive
                  ? "bg-primary/14 text-text-primary after:scale-x-100"
                  : "text-text-secondary after:scale-x-0 hover:after:scale-x-100",
              )}
            >
              <span className="relative flex">
                <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full border-2 border-surface-elevated bg-live px-1 font-sans text-[8px] font-semibold text-white">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-primary-light transition hover:bg-primary/12 md:hidden"
        >
          <Search className="h-[19px] w-[19px]" aria-hidden="true" />
        </button>

        {user ? (
          <>
            <NavQuickButton
              href={ROUTES.NOTIFICATIONS}
              label="Notifications"
              icon={Bell}
              badge={unreadNotificationCount}
            />

            {coinBalance !== null && (
              <div className="hidden items-center gap-1.5 rounded-full border border-warning/25 bg-warning/10 py-1.5 pr-2.5 pl-3 sm:flex">
                <Coins className="h-[15px] w-[15px] text-warning" aria-hidden="true" />
                <span className="font-sans text-[13px] font-semibold text-warning">{formatCount(coinBalance)}</span>
              </div>
            )}

            {isCreator ? (
              <></>
            ) : (
              <Link
                href={ROUTES.BECOME_CREATOR}
                className="hidden items-center gap-1.5 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark px-3.5 py-2 font-sans text-[12.5px] font-semibold text-white transition hover:-translate-y-0.5 sm:flex"
              >
                <Crown className="h-[15px] w-[15px]" aria-hidden="true" />
                Become Creator
              </Link>
            )}

            <Link
              href={ROUTES.PROFILE}
              aria-label="Your profile"
              className="relative h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-primary-light to-primary p-0.5 transition hover:-translate-y-0.5"
            >
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt=""
                  fill
                  sizes="40px"
                  className="rounded-full border-2 border-surface object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-surface bg-surface-elevated text-text-secondary">
                  <User className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
              )}
            </Link>
          </>
        ) : (
          <Link
            href={ROUTES.SIGN_IN}
            className="flex items-center gap-1.5 rounded-md bg-gradient-to-br from-primary-light to-primary px-3.5 py-2 font-sans text-[12.5px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

interface NavQuickButtonProps {
  href: string;
  label: string;
  icon: typeof Bell;
  badge: number;
}

function NavQuickButton({ href, label, icon: Icon, badge }: NavQuickButtonProps) {
  return (
    <Link
      href={href}
      aria-label={badge > 0 ? `${label} (${badge} unread)` : label}
      className="group relative flex h-[42px] w-[42px] items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-primary-light transition hover:bg-primary/12 hover:text-text-primary hover:shadow-[0_0_16px_-4px_rgba(0,175,240,.5)]"
    >
      <Icon
        className="h-[19px] w-[19px] transition-transform duration-200 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6"
        aria-hidden="true"
      />
      {badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-background bg-live px-1 font-sans text-[9px] font-semibold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  );
}
