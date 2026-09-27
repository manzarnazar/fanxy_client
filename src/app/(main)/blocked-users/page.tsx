import type { Metadata } from "next";
import { BlockedUsersPageContent } from "@/features/blocked-users/components/BlockedUsersPageContent";

export const metadata: Metadata = {
  title: "Blocked Accounts | yourappname",
  description: "Manage the accounts you've blocked on yourappname.",
};

export default function BlockedUsersPage() {
  return <BlockedUsersPageContent />;
}
