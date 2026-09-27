import type { Metadata } from "next";
import { UploadStoryPageContent } from "@/features/my-content/components/UploadStoryPageContent";

export const metadata: Metadata = {
  title: "Upload Story | yourappname",
  description: "Share a 24-hour story with your fans on yourappname.",
};

export default function UploadStoryPage() {
  return <UploadStoryPageContent />;
}
