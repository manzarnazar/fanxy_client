import type { Metadata } from "next";
import { MyContentPageContent } from "@/features/my-content/components/MyContentPageContent";

export const metadata: Metadata = {
  title: "My Content | yourappname",
  description: "Manage your posts, reels, and stories on yourappname.",
};

export default function MyContentPage() {
  return <MyContentPageContent />;
}
