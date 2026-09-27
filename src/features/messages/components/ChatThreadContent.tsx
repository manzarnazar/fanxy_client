"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, MessageCircle, User } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useChatThread } from "@/features/messages/hooks/useChatThread";
import { ChatMessageBubble } from "@/features/messages/components/ChatMessageBubble";
import { ChatComposer } from "@/features/messages/components/ChatComposer";

interface ChatThreadContentProps {
  conversationId: string;
}

export function ChatThreadContent({ conversationId }: ChatThreadContentProps) {
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const { conversation, messages, status, sending, send, chatReady } = useChatThread(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  if (!isBootstrapped) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-light" aria-hidden="true" />
      </main>
    );
  }

  if (!user || !chatReady) {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[680px]">
          <SectionStateMessage
            variant="empty"
            title={user ? "Chat isn't available for this account" : "Sign in to see your messages"}
            body={
              user
                ? "This account isn't linked to the chat service yet. Sign in once with Google or your phone number to activate messaging."
                : "Your conversations live in your account — sign in to pick them up."
            }
            emptyHref={user ? ROUTES.MESSAGES : ROUTES.SIGN_IN}
            emptyLabel={user ? "Back to Messages" : "Sign In"}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 border-b border-primary/12 bg-surface-elevated/70 px-4 py-3 backdrop-blur-xl">
        <Link
          href={ROUTES.MESSAGES}
          aria-label="Back to messages"
          className="flex h-9.5 w-9.5 items-center justify-center rounded-md border border-primary/16 bg-surface/60 text-text-secondary transition hover:bg-primary/12"
        >
          <ArrowLeft className="h-[17px] w-[17px]" aria-hidden="true" />
        </Link>

        <div className="relative shrink-0">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-surface-elevated">
            {conversation?.avatarUrl ? (
              <Image src={conversation.avatarUrl} alt="" width={40} height={40} className="h-full w-full object-cover" />
            ) : (
              <User className="h-4.5 w-4.5 text-text-secondary/60" aria-hidden="true" />
            )}
          </span>
          {conversation?.online && (
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate font-sans text-[14.5px] font-semibold text-text-primary">
            {conversation?.name ?? "Conversation"}
          </div>
          {conversation?.username && (
            <div className="truncate font-sans text-[11px] font-light text-text-secondary/65">{conversation.username}</div>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-[760px] flex-col gap-2">
          {status === "loading" && messages.length === 0 && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-primary-light" aria-hidden="true" />
            </div>
          )}

          {status === "failed" && (
            <SectionStateMessage
              variant="error"
              title="Couldn't load this conversation"
              body="You may not have access to it, or the connection dropped."
              minHeightClassName="min-h-[240px]"
            />
          )}

          {status === "succeeded" && messages.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <MessageCircle className="h-9 w-9 text-primary-light/60" aria-hidden="true" />
              <p className="font-sans text-[13.5px] font-medium text-text-primary">No messages yet</p>
              <p className="font-sans text-[12px] font-light text-text-secondary/70">
                Say hello — messages are delivered instantly.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>

      <ChatComposer sending={sending} onSend={send} />
    </main>
  );
}
