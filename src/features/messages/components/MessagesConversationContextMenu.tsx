"use client";

import type { LucideIcon } from "lucide-react";
import { DropdownMenu } from "@/components/shared/DropdownMenu";

export interface MessagesContextMenuItem {
  key: string;
  icon: LucideIcon;
  label: string;
  colorClassName: string;
  onClick: () => void;
}

interface MessagesConversationContextMenuProps {
  open: boolean;
  onClose: () => void;
  items: MessagesContextMenuItem[];
  anchorRef: React.RefObject<HTMLElement | null>;
}

export function MessagesConversationContextMenu({ open, onClose, items, anchorRef }: MessagesConversationContextMenuProps) {
  return (
    <DropdownMenu
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      ariaLabel="Conversation options"
      panelClassName="w-47 overflow-hidden rounded-md border border-primary/22 bg-surface-elevated py-1 shadow-dropdown"
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="menuitem"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
            item.onClick();
          }}
          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left font-sans text-[12.5px] text-text-primary transition hover:bg-primary/10"
        >
          <item.icon className={`h-3.5 w-3.5 shrink-0 ${item.colorClassName}`} aria-hidden="true" />
          {item.label}
        </button>
      ))}
    </DropdownMenu>
  );
}
