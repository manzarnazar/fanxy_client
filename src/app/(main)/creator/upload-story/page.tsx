import type { Metadata } from "next";
import { UploadStoryPageContent } from "@/features/my-content/components/UploadStoryPageContent";

export const metadata: Metadata = {
  title: "Upload Story | Fanxy",
  description: "Share a 24-hour story with your fans on Fanxy.",
};

export default function UploadStoryPage() {
  return <UploadStoryPageContent />;
}
