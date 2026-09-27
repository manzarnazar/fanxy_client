import type { Metadata } from "next";
import { ProfilePageContent } from "@/app/(main)/profile/ProfilePageContent";

export const metadata: Metadata = {
  title: "Profile | yourappname",
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}
