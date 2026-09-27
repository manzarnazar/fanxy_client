import type { Metadata } from "next";
import { ProfilePageContent } from "@/app/(main)/profile/ProfilePageContent";

export const metadata: Metadata = {
  title: "Profile | Fanxy",
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}
