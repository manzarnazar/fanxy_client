import type { Metadata } from "next";
import { SettingsPageContent } from "@/features/settings/components/SettingsPageContent";

export const metadata: Metadata = {
  title: "Settings | Fanxy",
  description:
    "Manage your profile, privacy, notifications, and account settings on Fanxy.",
};

export default function SettingsPage() {
  return <SettingsPageContent />;
}
