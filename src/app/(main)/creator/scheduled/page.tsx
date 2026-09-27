import type { Metadata } from "next";
import { ScheduledPostsPageContent } from "@/features/scheduled-posts/components/ScheduledPostsPageContent";

export const metadata: Metadata = {
  title: "Scheduled Posts | yourappname",
  description:
    "Plan and manage your automatically publishing content on yourappname.",
};

export default function ScheduledPostsPage() {
  return <ScheduledPostsPageContent />;
}
