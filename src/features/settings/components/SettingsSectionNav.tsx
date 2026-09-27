import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SettingsNavGroupDef } from "@/features/settings/constants/settings";
import type { SettingsSectionKey } from "@/features/settings/types/settings.types";

export interface SettingsSectionNavProps {
  groups: SettingsNavGroupDef[];
  activeSection: SettingsSectionKey;
  onSelect: (key: SettingsSectionKey) => void;
  query: string;
  onQueryChange: (value: string) => void;
}

export function SettingsSectionNav({ groups, activeSection, onSelect, query, onQueryChange }: SettingsSectionNavProps) {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-primary/10 bg-surface/40 px-3.5 py-4.5 lg:flex">
      <div className="mb-4 px-1 font-display text-xl font-semibold text-text-primary">Settings</div>

      <div className="mb-4 flex items-center gap-2.5 rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Filter settings…"
          aria-label="Filter settings"
          className="w-full bg-transparent font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
        />
      </div>

      <nav className="flex flex-col gap-4.5">
        {groups.map((group, index) => (
          <div key={`${group.group}-${index}`}>
            <div className="px-3.5 pb-1.5 font-sans text-[10px] font-medium tracking-wide text-text-muted uppercase">
              {group.group}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = !item.href && activeSection === item.key;
                const Icon = item.icon;
                const danger = Boolean(item.danger);

                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="relative flex items-center gap-3 rounded-md px-3.5 py-2.5 text-left transition-colors hover:bg-primary/10"
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0 text-text-secondary/60" aria-hidden="true" />
                      <span className="font-sans text-[13.5px] font-normal text-text-secondary/82">{item.label}</span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onSelect(item.key)}
                    className={cn(
                      "relative flex items-center gap-3 rounded-md px-3.5 py-2.5 text-left transition-colors hover:bg-primary/10",
                      isActive && "bg-primary/12",
                    )}
                  >
                    {isActive && (
                      <span className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-primary-light to-primary shadow-glow" />
                    )}
                    <span className="relative flex shrink-0">
                      <Icon
                        className={cn("h-[18px] w-[18px]", danger ? "text-danger" : isActive ? "text-primary-light" : "text-text-secondary/60")}
                        aria-hidden="true"
                      />
                      {danger && <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-danger" aria-hidden="true" />}
                    </span>
                    <span
                      className={cn(
                        "font-sans text-[13.5px]",
                        danger ? "text-danger" : isActive ? "font-medium text-text-primary" : "font-normal text-text-secondary/82",
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
