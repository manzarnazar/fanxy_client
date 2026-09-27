import type { Metadata } from "next";
import { BecomeCreatorPageContent } from "@/features/become-creator/components/BecomeCreatorPageContent";

export const metadata: Metadata = {
  title: "Become a Creator | Fanxy",
  description:
    "Apply to become a Fanxy creator and start earning from your content.",
};

export default function BecomeCreatorPage() {
  return <BecomeCreatorPageContent />;
}
