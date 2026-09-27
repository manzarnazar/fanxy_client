import { Keyboard } from "lucide-react";
import { KEYBOARD_SHORTCUTS } from "@/features/story-view/constants/story-view";

interface StoryShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export function StoryShortcutsModal({ open, onClose }: StoryShortcutsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/72 p-4 backdrop-blur-[4px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[400px] rounded-[22px] border border-primary/22 bg-surface-elevated p-6 shadow-[0_34px_70px_-26px_rgba(0,0,0,.85)]"
      >
        <div className="mb-4 flex items-center gap-2.5">
          <Keyboard className="h-[22px] w-[22px] text-primary-light" aria-hidden="true" />
          <span className="font-display text-xl font-semibold text-text-primary">Keyboard shortcuts</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {KEYBOARD_SHORTCUTS.map((shortcut) => (
            <div key={shortcut.action} className="flex items-center justify-between">
              <span className="font-sans text-sm font-light text-text-secondary">{shortcut.action}</span>
              <span className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 font-sans text-[11px] font-semibold text-primary-light">
                {shortcut.key}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
