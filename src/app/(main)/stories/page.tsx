import type { Metadata } from "next";
import { StoriesIndexContent } from "@/features/story-view/components/StoriesIndexContent";

export const metadata: Metadata = {
  title: "Stories | Fanxy",
  description:
    "Catch up on the latest 24-hour stories from creators on Fanxy.",
};

export default function StoriesPage() {
  return <StoriesIndexContent />;
}
