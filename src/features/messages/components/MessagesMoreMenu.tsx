"use client";

import { useRef, useState } from "react";
import { Archive, CheckCheck, MoreHorizontal } from "lucide-react";
import { DropdownMenu } from "@/components/shared/DropdownMenu";
import { cn } from "@/lib/utils/cn";

interface MessagesMoreMenuProps {
  showArchived: boolean;
  onMarkAllRead: () => void;
  onToggleArchived: () => void;
}

export function MessagesMoreMenu({ showArchived, onMarkAllRead, onToggleArchived }: MessagesMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div>
      <button
        ref={anchorRef}
        type="button"
        title="More"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/18 bg-surface/60 text-text-secondary transition hover:bg-primary/12 hover:text-text-primary"
      >
        <MoreHorizontal className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>

      <DropdownMenu
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
        ariaLabel="Message options"
        panelClassName="w-[196px] overflow-hidden rounded-xl border border-primary/22 bg-surface-elevated p-1.5 shadow-dropdown"
      >
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onMarkAllRead();
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 font-sans text-[12.5px] font-medium text-success transition hover:bg-primary/10"
        >
          <CheckCheck className="h-4 w-4" aria-hidden="true" />
          Mark all as read
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onToggleArchived();
          }}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 font-sans text-[12.5px] font-medium transition hover:bg-primary/10",
            showArchived ? "text-primary-light" : "text-text-secondary",
          )}
        >
          <Archive className="h-4 w-4" aria-hidden="true" />
          {showArchived ? "Hide archived chats" : "Archived chats"}
        </button>
      </DropdownMenu>
    </div>
  );
}
