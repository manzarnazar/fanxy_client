import type { Metadata } from "next";
import { LiveDiscoveryContent } from "@/features/live/components/LiveDiscoveryContent";

export const metadata: Metadata = {
  title: "Live | Fanxy",
  description: "Watch live streams from your favorite creators on Fanxy.",
};

export default function LivePage() {
  return <LiveDiscoveryContent />;
}
