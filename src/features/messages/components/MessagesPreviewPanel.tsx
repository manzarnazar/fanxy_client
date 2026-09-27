"use client";

import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon, MessageCircle, Play, User, UserX } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import { useConversationPreview } from "@/features/messages/hooks/useConversationPreview";
import type { Conversation } from "@/features/messages/types/messages.types";

interface MessagesPreviewPanelProps {
  conversation: Conversation;
  onBlock: (conversation: Conversation) => void;
}

export function MessagesPreviewPanel({ conversation, onBlock }: MessagesPreviewPanelProps) {
  const preview = useConversationPreview(conversation.id);

  return (
    <div className="mx-auto w-full max-w-[720px] px-8 pb-10">
      {/* Cover hero — the chat directory has no cover image, so a branded gradient stands in. */}
      <div className="relative h-[180px] overflow-hidden rounded-b-3xl bg-[radial-gradient(120%_130%_at_50%_-20%,#0b3f5c_0%,#07293f_45%,#041a29_75%,#020c14_100%)]">
        <div className="pointer-events-none absolute -top-10 -left-8 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-6 -bottom-12 h-44 w-44 rounded-full bg-secondary/14 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Identity */}
      <div className="-mt-14 flex flex-col items-start px-1">
        <div className="relative">
          <div className="h-[104px] w-[104px] rounded-full bg-gradient-to-br from-primary-light to-primary p-[3px]">
            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[3px] border-surface bg-surface-elevated">
              {conversation.avatarUrl ? (
                <Image src={conversation.avatarUrl} alt="" width={98} height={98} className="h-full w-full object-cover" />
              ) : (
                <User className="h-9 w-9 text-text-secondary/60" aria-hidden="true" />
              )}
            </span>
          </div>
          <span
            className={cn(
              "absolute right-1.5 bottom-1.5 h-5 w-5 rounded-full border-[3px] border-surface",
              conversation.online ? "animate-pulse bg-success" : "bg-text-secondary/40",
            )}
          />
        </div>

        <h2 className="mt-3 font-display text-[28px] leading-tight font-semibold text-text-primary">{conversation.name}</h2>
        <div className="mt-0.5 flex items-center gap-2 font-sans text-[12.5px] font-light text-text-secondary/75">
          {conversation.username && <span>@{conversation.username}</span>}
          {conversation.username && <span className="h-[3px] w-[3px] rounded-full bg-text-secondary/30" />}
          <span className={cn(conversation.online && "text-success")}>{conversation.online ? "Online" : "Offline"}</span>
        </div>
      </div>

      {/* Primary actions */}
      <div className="mt-5 flex items-center gap-2.5">
        <Link
          href={ROUTES.CHAT(conversation.id)}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary-light to-primary font-sans text-[14px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
        >
          <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
          Open Chat
        </Link>
        <button
          type="button"
          title="Block user"
          onClick={() => onBlock(conversation)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-danger/26 bg-danger/8 text-danger transition hover:bg-danger/16"
        >
          <UserX className="h-[19px] w-[19px]" aria-hidden="true" />
        </button>
      </div>

      {/* Recent messages — live from the same Firestore stream the chat page uses */}
      <div className="mt-5 rounded-[20px] border border-primary/14 bg-surface/50 p-5">
        <div className="mb-3.5 flex items-center justify-between">
          <span className="font-display text-base font-semibold text-text-primary">Recent messages</span>
          {conversation.lastMessageTimeLabel && (
            <span className="font-sans text-[11px] font-light text-text-secondary/60">
              Active {conversation.lastMessageTimeLabel}
            </span>
          )}
        </div>

        {preview.loading && preview.recentMessages.length === 0 ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={cn("h-9 w-3/5 animate-pulse rounded-[14px] bg-primary/8", index % 2 === 1 && "self-end")}
              />
            ))}
          </div>
        ) : preview.recentMessages.length === 0 ? (
          <p className="font-sans text-[12.5px] font-light text-text-secondary/70">
            No messages yet — open the chat and say hello.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {preview.recentMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[76%] px-3.5 py-2 font-sans text-[12.5px] leading-relaxed",
                  message.fromMe
                    ? "self-end rounded-[14px] rounded-br-[4px] bg-gradient-to-br from-primary/22 to-primary-dark/18 text-text-primary"
                    : "self-start rounded-[14px] rounded-bl-[4px] border border-primary/10 bg-surface-elevated/70 text-text-primary",
                )}
              >
                {message.kind === "text" ? (
                  <span className="break-words">{message.content}</span>
                ) : (
                  <span className="flex items-center gap-1.5 italic opacity-85">
                    {message.kind === "video" ? (
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {message.kind === "video" ? "Video" : "Photo"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shared media — real image/video messages from this conversation */}
      {preview.mediaItems.length > 0 && (
        <div className="mt-4 rounded-[20px] border border-primary/14 bg-surface/50 p-5">
          <div className="mb-3.5 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary-light" aria-hidden="true" />
            <span className="font-display text-base font-semibold text-text-primary">Shared media</span>
            <span className="ml-auto font-sans text-[11px] font-light text-text-secondary/60">
              {preview.mediaItems.length} items
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {preview.mediaItems.slice(0, 8).map((item) => (
              <a
                key={item.id}
                href={item.content}
                target="_blank"
                rel="noreferrer"
                className="relative aspect-square overflow-hidden rounded-[13px] bg-surface-elevated transition hover:-translate-y-0.5"
              >
                {item.kind === "video" ? (
                  <>
                    <video src={item.content} muted playsInline className="h-full w-full object-cover" />
                    <span className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </>
                ) : (
                  <Image src={item.content} alt="" fill sizes="160px" className="object-cover" />
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
