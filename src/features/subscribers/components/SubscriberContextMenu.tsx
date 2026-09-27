"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, MoreHorizontal, ShieldOff, User } from "lucide-react";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { ROUTES } from "@/lib/constants/routes";
import type { Subscriber } from "@/features/subscribers/types/subscribers.types";

interface SubscriberContextMenuProps {
  subscriber: Subscriber;
  onToggleBlock: () => void;
}

export function SubscriberContextMenu({ subscriber, onToggleBlock }: SubscriberContextMenuProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-7.5 w-7.5 items-center justify-center rounded-md text-text-secondary/60 transition hover:bg-primary/12 hover:text-text-primary"
      >
        <MoreHorizontal className="h-[17px] w-[17px]" aria-hidden="true" />
      </button>

      <DropdownMenu open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} ariaLabel="Subscriber options">
        <Link
          href={ROUTES.CREATOR_PROFILE(subscriber.userId)}
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left font-sans text-[12.5px] text-text-secondary transition hover:bg-primary/10 hover:text-text-primary"
        >
          <User className="h-3.5 w-3.5" aria-hidden="true" />
          View profile
        </Link>
        <Link
          href={ROUTES.MESSAGES}
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left font-sans text-[12.5px] text-text-secondary transition hover:bg-primary/10 hover:text-text-primary"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Message
        </Link>
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onToggleBlock();
          }}
          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left font-sans text-[12.5px] text-danger transition hover:bg-danger/12"
        >
          <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
          {subscriber.blocked ? "Unblock" : "Block"}
        </button>
      </DropdownMenu>
    </div>
  );
}
