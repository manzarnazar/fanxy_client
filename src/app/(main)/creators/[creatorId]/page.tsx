import type { Metadata } from "next";
import { CreatorProfilePageContent } from "@/features/creator-profile/components/CreatorProfilePageContent";

interface CreatorProfileRouteParams {
  params: Promise<{ creatorId: string }>;
}

export const metadata: Metadata = {
  title: "Creator Profile | yourappname",
  description:
    "View a creator's profile, posts, and subscription plans on yourappname.",
};

export default async function CreatorProfilePage({
  params,
}: CreatorProfileRouteParams) {
  const { creatorId } = await params;
  return <CreatorProfilePageContent creatorId={creatorId} />;
}
