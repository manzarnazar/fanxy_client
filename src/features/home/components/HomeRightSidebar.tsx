import { HomeQuickCreate } from "@/features/home/components/HomeQuickCreate";

interface HomeRightSidebarProps {
  isCreator: boolean;
}

export function HomeRightSidebar({ isCreator }: HomeRightSidebarProps) {
  return (
    <aside className="hidden h-full w-[334px] shrink-0 overflow-y-auto border-l border-primary/10 px-5 py-5.5 xl:block">
      <div className="flex flex-col gap-4">
        {isCreator && <HomeQuickCreate />}
        <p className="px-1 font-sans text-[11px] leading-relaxed text-text-muted/70">
          © 2026 Fanxy · About · Help · Terms · Privacy
        </p>
      </div>
    </aside>
  );
}
