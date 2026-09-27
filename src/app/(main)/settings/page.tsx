import type { Metadata } from "next";
import { SettingsPageContent } from "@/features/settings/components/SettingsPageContent";

export const metadata: Metadata = {
  title: "Settings | yourappname",
  description:
    "Manage your profile, privacy, notifications, and account settings on yourappname.",
};

export default function SettingsPage() {
  return <SettingsPageContent />;
}
