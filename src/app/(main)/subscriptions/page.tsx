import type { Metadata } from "next";
import { SubscriptionsPageContent } from "@/features/subscriptions/components/SubscriptionsPageContent";

export const metadata: Metadata = {
  title: "Subscriptions | yourappname",
  description: "Manage your creator memberships and renewals on yourappname.",
};

export default function SubscriptionsPage() {
  return <SubscriptionsPageContent />;
}
