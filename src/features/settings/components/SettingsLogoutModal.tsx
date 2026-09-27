import { LogOut, X } from "lucide-react";

interface SettingsLogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SettingsLogoutModal({ open, onClose, onConfirm }: SettingsLogoutModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Log out"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[380px] rounded-xl border border-primary/22 bg-surface-elevated p-6.5"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/12 text-primary-light">
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-md border border-primary/20 bg-surface/70 text-primary-light transition hover:bg-primary/12"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="font-display text-xl font-semibold text-text-primary">Log out?</div>
        <p className="mt-2 font-sans text-[13px] leading-relaxed font-light text-text-secondary/75">
          You&apos;ll be signed out from this device. You can log back in anytime.
        </p>

        <div className="mt-5.5 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-primary/20 bg-surface/60 py-3 font-sans text-[13px] font-semibold text-text-secondary transition hover:bg-primary/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-md bg-gradient-to-br from-primary-light to-primary py-3 font-sans text-[13px] font-semibold text-[#03283a] transition hover:-translate-y-0.5"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
