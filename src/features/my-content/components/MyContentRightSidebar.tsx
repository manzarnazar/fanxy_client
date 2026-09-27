import { MyContentTopPerformingWidget } from "@/features/my-content/components/MyContentTopPerformingWidget";
import type { ContentItem } from "@/features/my-content/types/my-content.types";

interface MyContentRightSidebarProps {
  topPerforming: ContentItem[];
}

export function MyContentRightSidebar({ topPerforming }: MyContentRightSidebarProps) {
  if (topPerforming.length === 0) return null;

  return (
    <aside className="hidden h-full w-[322px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-primary/10 px-4.5 py-5.5 xl:flex">
      <MyContentTopPerformingWidget items={topPerforming} />
    </aside>
  );
}
