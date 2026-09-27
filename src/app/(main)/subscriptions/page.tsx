import type { Metadata } from "next";
import { SubscriptionsPageContent } from "@/features/subscriptions/components/SubscriptionsPageContent";

export const metadata: Metadata = {
  title: "Subscriptions | Fanxy",
  description: "Manage your creator memberships and renewals on Fanxy.",
};

export default function SubscriptionsPage() {
  return <SubscriptionsPageContent />;
}
