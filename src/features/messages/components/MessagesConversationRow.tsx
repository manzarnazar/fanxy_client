"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Archive,
  ArchiveRestore,
  Bell,
  Check,
  CheckCheck,
  MoreHorizontal,
  Pin,
  PinOff,
  User,
  UserX,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  MessagesConversationContextMenu,
  type MessagesContextMenuItem,
} from "@/features/messages/components/MessagesConversationContextMenu";
import type { Conversation } from "@/features/messages/types/messages.types";

interface MessagesConversationRowProps {
  conversation: Conversation;
  selected: boolean;
  isArchivedRow?: boolean;
  onSelect: () => void;
  onMarkRead: () => void;
  onTogglePin: () => void;
  onToggleMute: () => void;
  onToggleArchive: () => void;
  onBlock: () => void;
}

export function MessagesConversationRow({
  conversation,
  selected,
  isArchivedRow = false,
  onSelect,
  onMarkRead,
  onTogglePin,
  onToggleMute,
  onToggleArchive,
  onBlock,
}: MessagesConversationRowProps) {
  const [ctxOpen, setCtxOpen] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const OutIcon = conversation.outgoingStatus ? (conversation.outgoingStatus === "read" ? CheckCheck : Check) : null;

  const menuItems: MessagesContextMenuItem[] = [
    ...(conversation.unread
      ? [{ key: "read", icon: Check, label: "Mark Read", colorClassName: "text-success", onClick: onMarkRead }]
      : []),
    conversation.pinned
      ? { key: "unpin", icon: PinOff, label: "Unpin", colorClassName: "text-accent-gold-light", onClick: onTogglePin }
      : { key: "pin", icon: Pin, label: "Pin", colorClassName: "text-accent-gold-light", onClick: onTogglePin },
    isArchivedRow
      ? { key: "unarchive", icon: ArchiveRestore, label: "Move to Inbox", colorClassName: "text-primary-light", onClick: onToggleArchive }
      : { key: "archive", icon: Archive, label: "Archive", colorClassName: "text-primary-light", onClick: onToggleArchive },
    conversation.muted
      ? { key: "unmute", icon: Bell, label: "Unmute", colorClassName: "text-accent-purple-light", onClick: onToggleMute }
      : { key: "mute", icon: VolumeX, label: "Mute", colorClassName: "text-accent-purple-light", onClick: onToggleMute },
    { key: "block", icon: UserX, label: "Block User", colorClassName: "text-danger", onClick: onBlock },
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        setCtxOpen(true);
      }}
      className={cn(
        "group relative flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 transition",
        selected ? "border-primary/32 bg-primary/14" : "border-transparent hover:bg-primary/6",
      )}
    >
      <div className="relative shrink-0">
        <div className="h-13 w-13 rounded-full bg-primary/18 p-0.5">
          <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-elevated">
            {conversation.avatarUrl ? (
              <Image src={conversation.avatarUrl} alt="" width={52} height={52} className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-text-secondary/60" aria-hidden="true" />
            )}
          </span>
        </div>
        <span
          className={cn(
            "absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-surface",
            conversation.online ? "bg-success" : "bg-text-secondary/40",
          )}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "truncate font-sans text-[13.5px]",
              conversation.unread ? "font-semibold text-text-primary" : "font-medium text-text-primary",
            )}
          >
            {conversation.name}
          </span>
          <div className="flex-1" />
          {conversation.pinned && <Pin className="h-3 w-3 shrink-0 text-accent-gold-light" aria-hidden="true" />}
          {conversation.muted && <VolumeX className="h-3 w-3 shrink-0 text-text-secondary/45" aria-hidden="true" />}
        </div>
        <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
          {OutIcon && (
            <OutIcon
              className={cn(
                "h-3.5 w-3.5 shrink-0",
                conversation.outgoingStatus === "read" ? "text-primary-light" : "text-text-secondary/50",
              )}
              aria-hidden="true"
            />
          )}
          <span
            className={cn(
              "min-w-0 flex-1 truncate font-sans text-xs",
              conversation.unread ? "font-normal text-text-primary/90" : "font-light text-text-secondary/60",
            )}
          >
            {conversation.lastMessageText}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span
          className={cn(
            "font-sans text-[10.5px] font-normal",
            conversation.unread ? "text-primary-light" : "text-text-secondary/50",
          )}
        >
          {conversation.lastMessageTimeLabel}
        </span>
        {conversation.unread && (
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              conversation.muted ? "bg-text-secondary/40" : "bg-gradient-to-br from-secondary-light to-secondary-dark",
            )}
            aria-label="Unread"
          />
        )}
      </div>

      <div
        className={cn(
          "absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5 rounded-md border border-primary/18 bg-surface-elevated/95 p-0.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100",
          ctxOpen && "opacity-100",
        )}
      >
        <button
          type="button"
          title={conversation.pinned ? "Unpin" : "Pin"}
          onClick={(event) => {
            event.stopPropagation();
            onTogglePin();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-md text-accent-gold-light transition hover:bg-accent-gold/16"
        >
          {conversation.pinned ? <PinOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Pin className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
        <button
          ref={moreButtonRef}
          type="button"
          title="More"
          onClick={(event) => {
            event.stopPropagation();
            setCtxOpen((prev) => !prev);
          }}
          aria-haspopup="menu"
          aria-expanded={ctxOpen}
          className="flex h-7 w-7 items-center justify-center rounded-md text-text-primary transition hover:bg-primary/16"
        >
          <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <MessagesConversationContextMenu open={ctxOpen} onClose={() => setCtxOpen(false)} items={menuItems} anchorRef={moreButtonRef} />
    </div>
  );
}
