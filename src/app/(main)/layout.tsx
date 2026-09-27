"use client";

import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppSettings } from "@/store/slices/appSettingsSlice";
import { useHomeUI } from "@/features/home/hooks/useHomeUI";
import { useConversationsSubscription } from "@/features/messages/hooks/useConversationsSubscription";
import { Header } from "@/components/layout/Header";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { PushNotificationsBridge } from "@/components/shared/PushNotificationsBridge";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";

const REELS_BACKGROUND_CLASSNAME =
  "[background:radial-gradient(1200px_700px_at_82%_-8%,rgba(0,175,240,.12),transparent_60%),radial-gradient(900px_600px_at_6%_14%,rgba(226,29,91,.07),transparent_55%),#03080d]";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const appSettingsStatus = useAppSelector((state) => state.appSettings.status);
  const ui = useHomeUI();

  useEffect(() => {
    if (appSettingsStatus === "idle") void dispatch(fetchAppSettings());
  }, [dispatch, appSettingsStatus]);
  const pathname = usePathname();
  const isReels = pathname.startsWith(ROUTES.REELS);
  const isCreator = user?.role === "creator";

  // Live Firestore chat listener — keeps the unread badge current everywhere.
  useConversationsSubscription();
  const unreadMessageCount = useAppSelector(
    (state) => state.messages.conversations.filter((conversation) => conversation.unread && !conversation.muted).length,
  );

  if (!isBootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      data-theme={isReels ? "dark" : undefined}
      className={cn("flex h-screen flex-col", isReels ? REELS_BACKGROUND_CLASSNAME : "bg-background")}
    >
      <Header
        user={user}
        coinBalance={null}
        unreadMessageCount={unreadMessageCount}
        unreadNotificationCount={0}
        onOpenSearch={ui.openSearch}
      />

      <div className="flex min-h-0 flex-1">
        <SidebarNav isCreator={isCreator} expanded={ui.sidebarExpanded} onToggleExpanded={ui.toggleSidebar} />
        {children}
      </div>

      <BottomNavBar unreadMessageCount={unreadMessageCount} />

      <PushNotificationsBridge />

      <SearchOverlay
        open={ui.searchOpen}
        query={ui.searchQuery}
        onQueryChange={ui.setSearchQuery}
        onClose={ui.closeSearch}
      />
    </div>
  );
}
