import Link from "next/link";
import { Camera, Coins, Plus, Radio, Search, Sparkles, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";

interface FabItem {
  label: string;
  icon: LucideIcon;
  href: string;
  iconClassName: string;
}

const CREATOR_FAB_ITEMS: FabItem[] = [
  { label: "Upload Post", icon: Camera, href: ROUTES.UPLOAD_POST, iconClassName: "bg-primary/14 text-primary-light" },
  {
    label: "Upload Story",
    icon: Sparkles,
    href: ROUTES.UPLOAD_STORY,
    iconClassName: "bg-accent-purple/16 text-accent-purple-light",
  },
  { label: "Go Live", icon: Radio, href: ROUTES.GO_LIVE, iconClassName: "bg-secondary-light/16 text-secondary-light" },
];

const USER_FAB_ITEMS: FabItem[] = [
  { label: "Recharge Coins", icon: Coins, href: ROUTES.WALLET, iconClassName: "bg-warning/16 text-warning" },
  { label: "Discover", icon: Search, href: ROUTES.SEARCH, iconClassName: "bg-primary/14 text-primary-light" },
];

interface HomeFabProps {
  isCreator: boolean;
  open: boolean;
  onToggle: () => void;
}

export function HomeFab({ isCreator, open, onToggle }: HomeFabProps) {
  const items = isCreator ? CREATOR_FAB_ITEMS : USER_FAB_ITEMS;

  return (
    <div className="fixed right-6 bottom-[92px] z-[45] flex flex-col-reverse items-end gap-2.5 xl:right-[352px] xl:bottom-[26px]">
      {open && (
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2.5 rounded-md border border-primary/22 bg-surface-elevated/92 py-2.5 pr-4 pl-3 shadow-[0_14px_30px_-16px_rgba(0,0,0,.7)] backdrop-blur-md transition hover:border-primary/50"
              >
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", item.iconClassName)}>
                  <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
                </span>
                <span className="font-sans text-[12.5px] font-medium whitespace-nowrap text-text-primary">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-label={open ? "Close quick actions" : "Open quick actions"}
        aria-expanded={open}
        className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-gradient-to-br from-primary-light via-primary to-primary-dark text-[#03283a] shadow-glow transition hover:scale-105"
      >
        {open ? (
          <X className="h-[26px] w-[26px]" aria-hidden="true" />
        ) : (
          <Plus className="h-[26px] w-[26px]" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
