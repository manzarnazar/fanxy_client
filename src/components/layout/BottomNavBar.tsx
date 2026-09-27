"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import { PRIMARY_NAV_ITEMS } from "@/lib/constants/nav";

interface BottomNavBarProps {
  unreadMessageCount: number;
}

export function BottomNavBar({ unreadMessageCount }: BottomNavBarProps) {
  const pathname = usePathname();

  const isTabActive = (href: string) => (href === ROUTES.HOME ? pathname === ROUTES.HOME : pathname.startsWith(href));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[66px] items-center justify-around border-t border-primary/16 bg-surface-elevated/94 px-1.5 backdrop-blur-xl lg:hidden">
      {PRIMARY_NAV_ITEMS.map((item) => {
        const isActive = isTabActive(item.href);
        const Icon = item.icon;
        return (
          <Link key={item.label} href={item.href} className="flex flex-1 flex-col items-center gap-0.5">
            <span className="relative flex">
              <Icon
                className={cn("h-[23px] w-[23px]", isActive ? "text-primary-light" : "text-text-secondary/65")}
                aria-hidden="true"
              />
              {item.href === ROUTES.MESSAGES && unreadMessageCount > 0 && (
                <span className="absolute -top-0.5 -right-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full border-[1.5px] border-background bg-live px-1 font-sans text-[7.5px] font-semibold text-white">
                  {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
                </span>
              )}
            </span>
            <span
              className={cn(
                "font-sans text-[9.5px]",
                isActive ? "font-semibold text-primary-light" : "font-normal text-text-secondary/65",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
      <Link href={ROUTES.PROFILE} className="flex flex-1 flex-col items-center gap-0.5">
        <User
          className={cn(
            "h-[23px] w-[23px]",
            isTabActive(ROUTES.PROFILE) ? "text-primary-light" : "text-text-secondary/65",
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "font-sans text-[9.5px]",
            isTabActive(ROUTES.PROFILE) ? "font-semibold text-primary-light" : "font-normal text-text-secondary/65",
          )}
        >
          Profile
        </span>
      </Link>
    </nav>
  );
}
