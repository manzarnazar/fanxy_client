import type { Metadata } from "next";
import { LiveDiscoveryContent } from "@/features/live/components/LiveDiscoveryContent";

export const metadata: Metadata = {
  title: "Live | yourappname",
  description: "Watch live streams from your favorite creators on yourappname.",
};

export default function LivePage() {
  return <LiveDiscoveryContent />;
}
