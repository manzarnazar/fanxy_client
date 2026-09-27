import type { Metadata } from "next";
import { NotificationsPageContent } from "@/features/notifications/components/NotificationsPageContent";

export const metadata: Metadata = {
  title: "Notifications | yourappname",
  description:
    "Stay on top of likes, comments, follows, gifts, and account activity on yourappname.",
};

export default function NotificationsPage() {
  return <NotificationsPageContent />;
}
