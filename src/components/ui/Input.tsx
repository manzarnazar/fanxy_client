import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  prefixLabel?: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
  helperText?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, icon, prefixLabel, error, rightElement, helperText, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          "rounded-md border bg-surface/60 px-4 pt-2 pb-2.5 backdrop-blur-md transition-colors",
          error
            ? "border-danger/60"
            : "border-border focus-within:border-primary/60 focus-within:shadow-ring",
        )}
      >
        <label
          htmlFor={inputId}
          className="block text-[10px] font-medium tracking-wider text-text-muted uppercase"
        >
          {label}
        </label>
        <div className="mt-0.5 flex items-center gap-2.5">
          {icon && (
            <span className="flex shrink-0 text-primary-light/80" aria-hidden="true">
              {icon}
            </span>
          )}
          {prefixLabel && (
            <span className="shrink-0 font-sans text-[15px] text-text-muted" aria-hidden="true">
              {prefixLabel}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full bg-transparent font-sans text-[15px] text-text-primary outline-none placeholder:text-placeholder",
              className,
            )}
            {...props}
          />
          {rightElement}
        </div>
      </div>
      {error && (
        <p id={errorId} role="alert" className="px-1 text-xs text-danger">
          {error}
        </p>
      )}
      {!error && helperText && <div className="px-1">{helperText}</div>}
    </div>
  );
});
