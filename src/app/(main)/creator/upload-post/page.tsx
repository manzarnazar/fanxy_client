import type { Metadata } from "next";
import { UploadPostPageContent } from "@/features/my-content/components/UploadPostPageContent";

export const metadata: Metadata = {
  title: "Upload Post | Fanxy",
  description: "Share a new post with your fans on Fanxy.",
};

export default function UploadPostPage() {
  return <UploadPostPageContent />;
}
