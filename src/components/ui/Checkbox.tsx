import { useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  id?: string;
  align?: "center" | "start";
}

export function Checkbox({ checked, onChange, label, id, align = "center" }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        "flex cursor-pointer gap-2.5 select-none",
        align === "center" ? "items-center" : "items-start",
      )}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-[7px] border-[1.5px] transition-colors",
          align === "start" && "mt-px",
          checked ? "border-primary bg-primary" : "border-border bg-transparent",
        )}
      >
        <Check
          className={cn("h-3 w-3 text-[#03283a] transition-opacity", checked ? "opacity-100" : "opacity-0")}
          strokeWidth={3}
          aria-hidden="true"
        />
      </span>
      <span className="text-sm leading-relaxed text-text-secondary">{label}</span>
    </label>
  );
}
