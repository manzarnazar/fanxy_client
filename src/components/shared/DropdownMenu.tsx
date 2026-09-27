"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DropdownMenuProps {
  open: boolean;
  onClose: () => void;
  /** The trigger element the panel anchors to (usually the 3-dot button). */
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  /** Panel classes — width/background/border etc. */
  panelClassName?: string;
  ariaLabel?: string;
}

const VIEWPORT_GUTTER = 8;
const ANCHOR_GAP = 6;

/**
 * Context-menu panel rendered through a portal with fixed positioning, so it
 * can never be clipped by a card's overflow-hidden or a scroll container —
 * the bug every inline `absolute` dropdown had. Right-aligns to the anchor,
 * flips above it when there's no room below, and closes on outside press,
 * Escape, scroll, or resize.
 */
export function DropdownMenu({ open, onClose, anchorRef, children, panelClassName, ariaLabel }: DropdownMenuProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // The panel renders hidden, gets measured, then is placed imperatively —
  // styling the DOM node directly avoids a setState-in-effect render cascade.
  useLayoutEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    const anchorRect = anchor.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();

    let top = anchorRect.bottom + ANCHOR_GAP;
    if (top + panelRect.height > window.innerHeight - VIEWPORT_GUTTER) {
      top = Math.max(VIEWPORT_GUTTER, anchorRect.top - ANCHOR_GAP - panelRect.height);
    }
    let left = anchorRect.right - panelRect.width;
    left = Math.min(Math.max(left, VIEWPORT_GUTTER), window.innerWidth - panelRect.width - VIEWPORT_GUTTER);

    panel.style.top = `${top}px`;
    panel.style.left = `${left}px`;
    panel.style.visibility = "visible";
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    // Scrolling/resizing invalidates the anchored position — close instead of chasing it.
    const handleReposition = () => onClose();

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open, onClose, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      role="menu"
      aria-label={ariaLabel}
      style={{ position: "fixed", top: -9999, left: -9999, visibility: "hidden" }}
      className={`z-50 ${panelClassName ?? "w-44 overflow-hidden rounded-md border border-primary/18 bg-surface-elevated py-1 shadow-dropdown"}`}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </div>,
    document.body,
  );
}
