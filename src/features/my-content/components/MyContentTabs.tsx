import { cn } from "@/lib/utils/cn";
import { CONTENT_TABS } from "@/features/my-content/constants/my-content";
import type { ContentTab } from "@/features/my-content/types/my-content.types";

interface MyContentTabsProps {
  activeTab: ContentTab;
  onSelect: (tab: ContentTab) => void;
  postsCount: number;
  storiesCount: number;
}

export function MyContentTabs({ activeTab, onSelect, postsCount, storiesCount }: MyContentTabsProps) {
  const countFor = (tab: ContentTab) => (tab === "post" ? postsCount : storiesCount);

  return (
    <div className="mb-3.5 flex gap-1.5">
      {CONTENT_TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelect(tab.key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 font-sans text-[12.5px] font-medium whitespace-nowrap transition",
              isActive
                ? "border-transparent bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
                : "border-primary/18 bg-surface/60 text-text-secondary/85 hover:bg-primary/10",
            )}
          >
            <tab.icon className="h-3.5 w-3.5" aria-hidden="true" />
            {tab.label}
            <span className={cn("rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold", isActive ? "bg-[#03283a]/20 text-[#03283a]" : "bg-primary/16 text-primary-light")}>
              {countFor(tab.key)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
