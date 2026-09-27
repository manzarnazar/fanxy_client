import { ChevronRight, LogOut } from "lucide-react";

interface SettingsAccountActionsSectionProps {
  onOpenLogout: () => void;
}

export function SettingsAccountActionsSection({ onOpenLogout }: SettingsAccountActionsSectionProps) {
  return (
    <button
      type="button"
      onClick={onOpenLogout}
      className="flex w-full items-center gap-3.5 rounded-xl border border-primary/14 bg-surface/50 p-4 text-left transition hover:border-primary/30"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary-light">
        <LogOut className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-sans text-[13.5px] font-normal text-text-primary">Log out</div>
        <div className="font-sans text-[11px] font-light text-text-secondary/70">Sign out from this device</div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-text-secondary/45" aria-hidden="true" />
    </button>
  );
}
