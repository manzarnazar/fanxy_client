import Image from "next/image";
import { Check, CheckCheck, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ChatMessage } from "@/features/messages/types/messages.types";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const ReadIcon = message.read ? CheckCheck : Check;

  return (
    <div className={cn("flex", message.fromMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[78%] overflow-hidden rounded-2xl px-3.5 py-2.5 sm:max-w-[64%]",
          message.fromMe
            ? "rounded-br-md bg-gradient-to-br from-primary-light to-primary text-[#03283a]"
            : "rounded-bl-md border border-primary/14 bg-surface-elevated/80 text-text-primary",
          message.kind !== "text" && "p-1.5",
        )}
      >
        {message.kind === "text" && (
          <p className="font-sans text-[13.5px] leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
        )}

        {message.kind === "image" && (
          <a href={message.content} target="_blank" rel="noreferrer" className="block">
            <Image
              src={message.content}
              alt="Photo message"
              width={280}
              height={280}
              className="max-h-[320px] w-auto rounded-xl object-cover"
            />
          </a>
        )}

        {message.kind === "video" && (
          <video src={message.content} controls playsInline className="max-h-[320px] w-full rounded-xl" />
        )}

        {message.kind === "other" && (
          <span className="flex items-center gap-1.5 px-2 py-1 font-sans text-[12px] italic opacity-80">
            <FileQuestion className="h-3.5 w-3.5" aria-hidden="true" />
            Unsupported message
          </span>
        )}

        <div
          className={cn(
            "mt-1 flex items-center justify-end gap-1",
            message.kind !== "text" && "px-2 pb-1",
            message.fromMe ? "text-[#03283a]/65" : "text-text-secondary/55",
          )}
        >
          <span className="font-sans text-[10px] font-light">{message.timeLabel}</span>
          {message.fromMe && (
            <ReadIcon className={cn("h-3 w-3", message.read ? "opacity-100" : "opacity-60")} aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
