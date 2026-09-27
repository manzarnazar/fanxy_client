import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-primary-light via-primary to-primary-dark text-[#03283a] shadow-glow hover:-translate-y-0.5",
  secondary:
    "border border-border bg-surface-elevated text-text-primary hover:border-primary/40 hover:bg-primary/10",
  outline:
    "border-[1.5px] border-primary/50 bg-transparent text-primary hover:bg-primary/10",
  ghost: "bg-transparent text-text-secondary hover:text-primary",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", isLoading = false, disabled, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex h-[54px] items-center justify-center gap-2 rounded-md px-6 font-sans text-[15px] font-semibold tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {isLoading && <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});
