import type { Metadata } from "next";
import { ChatThreadContent } from "@/features/messages/components/ChatThreadContent";

export const metadata: Metadata = {
  title: "Chat | yourappname",
};

export default async function ChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return <ChatThreadContent conversationId={conversationId} />;
}
