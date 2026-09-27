import type { Metadata } from "next";
import { ScheduledPostsPageContent } from "@/features/scheduled-posts/components/ScheduledPostsPageContent";

export const metadata: Metadata = {
  title: "Scheduled Posts | Fanxy",
  description:
    "Plan and manage your automatically publishing content on Fanxy.",
};

export default function ScheduledPostsPage() {
  return <ScheduledPostsPageContent />;
}
