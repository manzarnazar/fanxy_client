import type { Metadata } from "next";
import { MessagesPageContent } from "@/features/messages/components/MessagesPageContent";

export const metadata: Metadata = {
  title: "Messages | Fanxy",
  description: "Chat with creators and friends on Fanxy.",
};

export default function MessagesPage() {
  return <MessagesPageContent />;
}
