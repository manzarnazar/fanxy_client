import type { Metadata } from "next";
import { CreatorDashboardPageContent } from "@/features/creator-dashboard/components/CreatorDashboardPageContent";

export const metadata: Metadata = {
  title: "Creator Dashboard | yourappname",
  description:
    "Track your earnings, audience growth, and content performance on yourappname.",
};

export default function CreatorDashboardPage() {
  return <CreatorDashboardPageContent />;
}
