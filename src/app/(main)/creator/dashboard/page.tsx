import type { Metadata } from "next";
import { CreatorDashboardPageContent } from "@/features/creator-dashboard/components/CreatorDashboardPageContent";

export const metadata: Metadata = {
  title: "Creator Dashboard | Fanxy",
  description:
    "Track your earnings, audience growth, and content performance on Fanxy.",
};

export default function CreatorDashboardPage() {
  return <CreatorDashboardPageContent />;
}
