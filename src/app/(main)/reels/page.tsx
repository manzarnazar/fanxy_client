import type { Metadata } from "next";
import { ReelsPageContent } from "@/features/reels/components/ReelsPageContent";

export const metadata: Metadata = {
  title: "Reels | yourappname",
  description:
    "Watch vertical reels from your favorite creators on yourappname.",
};

export default function ReelsPage() {
  return <ReelsPageContent />;
}
