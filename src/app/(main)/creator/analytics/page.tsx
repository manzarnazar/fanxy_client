import type { Metadata } from "next";
import { AnalyticsPageContent } from "@/features/creator-analytics/components/AnalyticsPageContent";

export const metadata: Metadata = {
  title: "Analytics | yourappname",
  description:
    "Understand your audience, revenue and creator growth on yourappname.",
};

export default function AnalyticsPage() {
  return <AnalyticsPageContent />;
}
