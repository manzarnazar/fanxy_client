import type { Metadata } from "next";
import { UploadPostPageContent } from "@/features/my-content/components/UploadPostPageContent";

export const metadata: Metadata = {
  title: "Upload Post | yourappname",
  description: "Share a new post with your fans on yourappname.",
};

export default function UploadPostPage() {
  return <UploadPostPageContent />;
}
