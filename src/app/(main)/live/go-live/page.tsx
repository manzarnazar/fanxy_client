import type { Metadata } from "next";
import { GoLivePageContent } from "@/features/go-live/components/GoLivePageContent";

export const metadata: Metadata = {
  title: "Live Dashboard | yourappname",
  description:
    "Start, manage and grow your live streaming audience on yourappname.",
};

export default function GoLivePage() {
  return <GoLivePageContent />;
}
