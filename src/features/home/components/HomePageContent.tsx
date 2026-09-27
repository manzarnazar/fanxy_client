"use client";

import { useAppSelector } from "@/store/hooks";
import { useHomeUI } from "@/features/home/hooks/useHomeUI";
import { useHomeHighlights } from "@/features/home/hooks/useHomeHighlights";
import { HomeHeroWelcome } from "@/features/home/components/HomeHeroWelcome";
import { HomeStories } from "@/features/home/components/HomeStories";
import { HomeLiveNow } from "@/features/home/components/HomeLiveNow";
import { HomeFeed } from "@/features/home/components/HomeFeed";
import { HomeRightSidebar } from "@/features/home/components/HomeRightSidebar";
import { HomeFab } from "@/features/home/components/HomeFab";

export function HomePageContent() {
  const { user } = useAppSelector((state) => state.auth);
  const ui = useHomeUI();
  const highlights = useHomeHighlights();

  const isCreator = user?.role === "creator";

  return (
    <>
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
        <div className="mx-auto flex max-w-[640px] flex-col gap-5.5">
          <HomeHeroWelcome userName={user?.fullName ?? null} isCreator={isCreator} />
          <HomeStories stories={highlights.stories} isCreator={isCreator} />
          <HomeLiveNow liveCreators={highlights.liveUsers} />
          <HomeFeed />
        </div>
      </main>

      <HomeRightSidebar isCreator={isCreator} />

      {user && <HomeFab isCreator={isCreator} open={ui.fabOpen} onToggle={ui.toggleFab} />}
    </>
  );
}
