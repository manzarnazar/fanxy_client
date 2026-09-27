import type { Metadata } from "next";
import { LeaderboardPageContent } from "@/features/leaderboard/components/LeaderboardPageContent";

export const metadata: Metadata = {
  title: "Leaderboard | yourappname",
  description: "Top creators and top fans on yourappname.",
};

interface LeaderboardRouteProps {
  searchParams: Promise<{ creator?: string; name?: string }>;
}

export default async function LeaderboardPage({
  searchParams,
}: LeaderboardRouteProps) {
  const { creator, name } = await searchParams;
  return <LeaderboardPageContent creatorId={creator} creatorName={name} />;
}
