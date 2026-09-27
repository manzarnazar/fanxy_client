import type { Metadata } from "next";
import { ReelsPageContent } from "@/features/reels/components/ReelsPageContent";

export const metadata: Metadata = {
  title: "Reels | Fanxy",
  description:
    "Watch vertical reels from your favorite creators on Fanxy.",
};

export default function ReelsPage() {
  return <ReelsPageContent />;
}
