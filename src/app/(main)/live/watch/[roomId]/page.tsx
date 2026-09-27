import type { Metadata } from "next";
import { LiveWatchContent } from "@/features/live/components/LiveWatchContent";

export const metadata: Metadata = {
  title: "Watch Live | yourappname",
  description: "Watch a live stream on yourappname.",
};

interface LiveWatchRouteProps {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ host?: string }>;
}

export default async function LiveWatchPage({
  params,
  searchParams,
}: LiveWatchRouteProps) {
  const { roomId } = await params;
  const { host } = await searchParams;
  return (
    <LiveWatchContent roomId={decodeURIComponent(roomId)} hostId={host ?? ""} />
  );
}
