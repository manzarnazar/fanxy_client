import { Check, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SettingsSaveBarProps {
  saving: boolean;
  onDiscard: () => void;
  onSave: () => void;
}

export function SettingsSaveBar({ saving, onDiscard, onSave }: SettingsSaveBarProps) {
  return (
    <div className="sticky bottom-4 z-10 mt-4.5 flex flex-wrap items-center gap-3 rounded-2xl border border-accent-gold/28 bg-surface-elevated/85 px-5 py-4 shadow-dropdown backdrop-blur-md xl:col-span-2">
      <span className="flex items-center gap-2 font-sans text-[12.5px] font-medium text-accent-gold-light">
        <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
        You have unsaved changes.
      </span>
      <div className="ml-auto flex gap-2.5">
        <button
          type="button"
          onClick={onDiscard}
          disabled={saving}
          className="rounded-xl border border-primary/22 bg-surface/60 px-4.5 py-2 font-sans text-[12.5px] font-semibold text-text-secondary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 rounded-[13px] px-5 py-2 font-sans text-[12.5px] font-semibold shadow-glow transition",
            saving
              ? "cursor-not-allowed bg-primary/30 text-[#03283a]/70"
              : "bg-gradient-to-br from-primary-light to-primary text-[#03283a] hover:-translate-y-0.5",
          )}
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Check className="h-3.5 w-3.5" aria-hidden="true" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
