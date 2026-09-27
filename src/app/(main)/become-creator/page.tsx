import type { Metadata } from "next";
import { BecomeCreatorPageContent } from "@/features/become-creator/components/BecomeCreatorPageContent";

export const metadata: Metadata = {
  title: "Become a Creator | yourappname",
  description:
    "Apply to become a yourappname creator and start earning from your content.",
};

export default function BecomeCreatorPage() {
  return <BecomeCreatorPageContent />;
}
