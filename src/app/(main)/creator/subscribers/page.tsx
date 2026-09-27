import type { Metadata } from "next";
import { SubscribersPageContent } from "@/features/subscribers/components/SubscribersPageContent";

export const metadata: Metadata = {
  title: "My Subscribers | Fanxy",
  description: "Manage everyone subscribed to your packages on Fanxy.",
};

export default function SubscribersPage() {
  return <SubscribersPageContent />;
}
