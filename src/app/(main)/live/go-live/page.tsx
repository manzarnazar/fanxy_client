import type { Metadata } from "next";
import { GoLivePageContent } from "@/features/go-live/components/GoLivePageContent";

export const metadata: Metadata = {
  title: "Live Dashboard | Fanxy",
  description:
    "Start, manage and grow your live streaming audience on Fanxy.",
};

export default function GoLivePage() {
  return <GoLivePageContent />;
}
