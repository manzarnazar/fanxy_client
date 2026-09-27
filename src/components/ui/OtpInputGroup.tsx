import { useRef } from "react";
import { cn } from "@/lib/utils/cn";

interface OtpInputGroupProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  boxClassName?: string;
}

export function OtpInputGroup({ length = 6, value, onChange, hasError, boxClassName }: OtpInputGroupProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (index: number, digit: string) => {
    const digits = value.padEnd(length, " ").split("");
    digits[index] = digit || " ";
    onChange(digits.join(""));
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !value[index]?.trim() && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={(value[index] ?? "").trim()}
          onChange={(event) => setDigit(index, event.target.value.replace(/\D/g, ""))}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of verification code`}
          aria-invalid={hasError}
          className={cn(
            "h-[54px] w-full rounded-md border bg-surface/60 text-center font-display text-xl font-semibold text-text-primary outline-none transition-colors",
            hasError ? "border-danger/60" : "border-border focus:border-primary/60 focus:shadow-ring",
            boxClassName,
          )}
        />
      ))}
    </div>
  );
}
