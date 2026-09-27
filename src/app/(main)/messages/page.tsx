import type { Metadata } from "next";
import { MessagesPageContent } from "@/features/messages/components/MessagesPageContent";

export const metadata: Metadata = {
  title: "Messages | yourappname",
  description: "Chat with creators and friends on yourappname.",
};

export default function MessagesPage() {
  return <MessagesPageContent />;
}
