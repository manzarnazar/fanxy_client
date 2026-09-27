import { SubscribersRevenueByPackageWidget } from "@/features/subscribers/components/SubscribersRevenueByPackageWidget";
import { SubscribersTopSupportersWidget } from "@/features/subscribers/components/SubscribersTopSupportersWidget";
import type { PackageRevenueBreakdown, TopSupporter } from "@/features/subscribers/types/subscribers.types";

interface SubscribersRightSidebarProps {
  revenueByPackage: PackageRevenueBreakdown[];
  topFans: TopSupporter[];
}

export function SubscribersRightSidebar({ revenueByPackage, topFans }: SubscribersRightSidebarProps) {
  if (revenueByPackage.length === 0 && topFans.length === 0) return null;

  return (
    <aside className="hidden h-full w-[322px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-primary/10 px-4.5 py-5.5 xl:flex">
      <SubscribersRevenueByPackageWidget breakdown={revenueByPackage} />
      <SubscribersTopSupportersWidget topFans={topFans} />
    </aside>
  );
}
