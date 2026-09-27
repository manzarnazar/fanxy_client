import type { Metadata } from "next";
import { BlockedUsersPageContent } from "@/features/blocked-users/components/BlockedUsersPageContent";

export const metadata: Metadata = {
  title: "Blocked Accounts | Fanxy",
  description: "Manage the accounts you've blocked on Fanxy.",
};

export default function BlockedUsersPage() {
  return <BlockedUsersPageContent />;
}
