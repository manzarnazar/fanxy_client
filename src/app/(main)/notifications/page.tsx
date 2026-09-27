import type { Metadata } from "next";
import { NotificationsPageContent } from "@/features/notifications/components/NotificationsPageContent";

export const metadata: Metadata = {
  title: "Notifications | Fanxy",
  description:
    "Stay on top of likes, comments, follows, gifts, and account activity on Fanxy.",
};

export default function NotificationsPage() {
  return <NotificationsPageContent />;
}
