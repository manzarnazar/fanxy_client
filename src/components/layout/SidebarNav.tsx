"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ChevronsLeft, ChevronsRight, LayoutGrid, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import { CREATOR_STUDIO_NAV_ITEMS, NAV_ITEMS, type NavItem } from "@/lib/constants/nav";

interface SidebarNavProps {
  isCreator: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  /** Mobile drawer rendering: always expanded, visible below lg, no collapse button. */
  variant?: "desktop" | "mobile";
  /** Called after any nav item is activated (mobile drawer closes itself). */
  onNavigate?: () => void;
}

// "Bookmarks" links to Home (Home renders the stories rail) but shouldn't
// visually compete with the Home item.
const NAV_ITEMS_WITHOUT_OWN_ROUTE = new Set(["Bookmarks"]);

function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (NAV_ITEMS_WITHOUT_OWN_ROUTE.has(item.label)) return false;
  return item.href === ROUTES.HOME ? pathname === ROUTES.HOME : pathname.startsWith(item.href);
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  expanded: boolean;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
}

function SidebarItem({ icon: Icon, label, expanded, isActive = false, href, onClick }: SidebarItemProps) {
  const className = cn(
    "group relative flex w-full items-center gap-3.5 rounded-md px-3.5 py-2.5 transition-colors hover:bg-primary/10",
    expanded ? "justify-start" : "justify-center",
    isActive && "bg-primary/12 shadow-[inset_0_0_18px_-8px_rgba(0,175,240,.45)]",
  );

  const body = (
    <>
      {isActive && (
        <span className="absolute top-2.5 bottom-2.5 left-0 w-[3px] rounded-full bg-gradient-to-b from-primary-light to-primary" />
      )}
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-transform duration-200 motion-safe:group-hover:scale-110",
          isActive ? "text-primary-light" : "text-text-secondary/70",
        )}
        aria-hidden="true"
      />
      {expanded && (
        <span
          className={cn(
            "flex-1 truncate text-left font-sans text-sm",
            isActive ? "font-medium text-text-primary" : "font-normal text-text-secondary/85",
          )}
        >
          {label}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} title={label} onClick={onClick} className={className}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" title={label} onClick={onClick} className={className}>
      {body}
    </button>
  );
}

export function SidebarNav({ isCreator, expanded, onToggleExpanded, variant = "desktop", onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  // The sidebar has two modes for creators: the regular app nav and the
  // Creator Studio nav. Landing on a studio route opens studio mode by
  // default; the toggle items below override it explicitly.
  const pathIsStudio =
    pathname.startsWith("/creator") || pathname.startsWith(ROUTES.GO_LIVE) || pathname.startsWith(ROUTES.PAYMENT);
  const [modeOverride, setModeOverride] = useState<boolean | null>(null);
  const studioMode = isCreator && (modeOverride ?? pathIsStudio);

  const isMobile = variant === "mobile";

  return (
    <aside
      className={cn(
        isMobile
          ? "block h-full w-[260px] overflow-y-auto bg-surface-elevated p-3"
          : cn(
              "hidden h-full shrink-0 overflow-y-auto border-r border-primary/10 bg-surface/40 p-3 transition-[width] duration-300 lg:block",
              expanded ? "w-[240px]" : "w-[76px]",
            ),
      )}
      onClick={(event) => {
        // Any activated link/button counts as navigation for the mobile drawer.
        if (onNavigate && (event.target as HTMLElement).closest("a,button")) onNavigate();
      }}
    >
      {studioMode ? (
        <nav className="flex flex-col gap-0.5">
          <SidebarItem
            icon={ArrowLeft}
            label="Back to Home"
            expanded={expanded}
            onClick={() => {
              setModeOverride(false);
              router.push(ROUTES.HOME);
            }}
          />

          {expanded && (
            <div className="px-3.5 pt-3 pb-2 font-sans text-[10px] font-medium tracking-wide text-text-muted uppercase">
              Creator Studio
            </div>
          )}

          {CREATOR_STUDIO_NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              expanded={expanded}
              isActive={pathname.startsWith(item.href)}
              href={item.href}
            />
          ))}
        </nav>
      ) : (
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              expanded={expanded}
              isActive={isNavItemActive(item, pathname)}
              href={item.href}
            />
          ))}

          {isCreator && (
            <div className="mt-2 border-t border-primary/10 pt-2">
              <SidebarItem
                icon={LayoutGrid}
                label="Creator Studio"
                expanded={expanded}
                onClick={() => {
                  setModeOverride(true);
                  router.push(ROUTES.CREATOR_DASHBOARD)

                }}
              />
            </div>
          )}
        </nav>
      )}

      {!isMobile && (
      <button
        type="button"
        onClick={onToggleExpanded}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        className={cn(
          "mt-4 flex w-full items-center gap-3.5 rounded-md bg-surface/60 px-3.5 py-2.5 text-text-secondary transition-colors hover:bg-primary/10",
          expanded ? "justify-start" : "justify-center",
        )}
      >
        {expanded ? (
          <>
            <ChevronsLeft className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="font-sans text-sm">Collapse</span>
          </>
        ) : (
          <ChevronsRight className="h-5 w-5 shrink-0" aria-hidden="true" />
        )}
      </button>
      )}
    </aside>
  );
}
