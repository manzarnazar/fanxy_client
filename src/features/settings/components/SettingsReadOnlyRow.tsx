import { cn } from "@/lib/utils/cn";

interface SettingsReadOnlyRowProps {
  label: string;
  value: string;
  valueClassName?: string;
  showDot?: boolean;
  divider?: boolean;
}

export function SettingsReadOnlyRow({ label, value, valueClassName, showDot, divider = true }: SettingsReadOnlyRowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3 py-3", divider && "border-b border-primary/8")}>
      <span className="font-sans text-[12.5px] font-light text-text-secondary/70">{label}</span>
      <span className={cn("flex items-center gap-1.5 font-sans text-[13px] font-medium text-text-primary", valueClassName)}>
        {showDot && <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />}
        {value}
      </span>
    </div>
  );
}
