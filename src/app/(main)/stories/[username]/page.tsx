import type { Metadata } from "next";
import { StoryViewPageContent } from "@/features/story-view/components/StoryViewPageContent";

interface StoryViewRouteParams {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: StoryViewRouteParams): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username}'s story | yourappname`,
    description: `Watch ${username}'s latest stories on yourappname.`,
  };
}

export default async function StoryViewPage({ params }: StoryViewRouteParams) {
  const { username } = await params;
  return <StoryViewPageContent username={username} />;
}
