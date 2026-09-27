"use client";

import { useRef, useState } from "react";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu } from "@/components/shared/DropdownMenu";

interface PackageContextMenuProps {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function PackageContextMenu({ onEdit, onDuplicate, onDelete }: PackageContextMenuProps) {
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

      <DropdownMenu
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
        ariaLabel="Package options"
        panelClassName="w-40 overflow-hidden rounded-md border border-primary/18 bg-surface-elevated py-1 shadow-dropdown"
      >
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onEdit();
          }}
          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left font-sans text-[12.5px] text-text-secondary transition hover:bg-primary/10 hover:text-text-primary"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onDuplicate();
          }}
          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left font-sans text-[12.5px] text-text-secondary transition hover:bg-primary/10 hover:text-text-primary"
        >
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          Duplicate
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onDelete();
          }}
          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left font-sans text-[12.5px] text-danger transition hover:bg-danger/12"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Delete
        </button>
      </DropdownMenu>
    </div>
  );
}
