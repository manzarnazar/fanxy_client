import Link from "next/link";
import { CREATOR_STUDIO_NAV_ITEMS } from "@/lib/constants/nav";

export function HomeQuickCreate() {
  const items = CREATOR_STUDIO_NAV_ITEMS.filter((item) => item.label !== "Creator Dashboard");

  return (
    <div className="rounded-lg border border-primary/14 bg-surface/50 p-4">
      <div className="mb-3 font-display text-base font-semibold text-text-primary">Quick create</div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 rounded-md border border-primary/12 bg-background/60 p-2.5 transition hover:border-primary/30 hover:bg-primary/10"
            >
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-sm bg-primary/14 text-primary-light">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-sans text-[11.5px] font-normal text-text-secondary/90">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
