import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { SettingsSectionNavProps } from "@/features/settings/components/SettingsSectionNav";

type SettingsSectionTabsProps = Omit<SettingsSectionNavProps, "query" | "onQueryChange">;

export function SettingsSectionTabs({ groups, activeSection, onSelect }: SettingsSectionTabsProps) {
  const flatItems = groups.flatMap((group) => group.items);

  return (
    <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 lg:hidden">
      {flatItems.map((item) => {
        const isActive = !item.href && activeSection === item.key;
        const Icon = item.icon;

        if (item.href) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-primary/18 bg-surface/60 px-3.5 py-2 font-sans text-[12.5px] font-medium whitespace-nowrap text-text-secondary/85 transition hover:bg-primary/10"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        }

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect(item.key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 font-sans text-[12.5px] font-medium whitespace-nowrap transition",
              isActive
                ? "border-transparent bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
                : item.danger
                  ? "border-danger/28 bg-danger/8 text-danger"
                  : "border-primary/18 bg-surface/60 text-text-secondary/85 hover:bg-primary/10",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
