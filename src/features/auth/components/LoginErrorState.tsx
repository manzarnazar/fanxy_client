import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LoginErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export function LoginErrorState({ onRetry, message = "Invalid or expired code." }: LoginErrorStateProps) {
  return (
    <div role="alert" className="animate-[rise_0.4s_ease_both] py-2.5 text-center">
      <div className="mx-auto mb-5 flex h-[82px] w-[82px] items-center justify-center rounded-xl bg-danger/15 text-danger shadow-[inset_0_0_0_1.5px_rgba(255,120,140,.35)]">
        <AlertCircle className="h-10 w-10" aria-hidden="true" />
      </div>
      <h2 className="font-display text-[27px] font-semibold text-text-primary">Sign in failed</h2>
      <p className="mt-2 text-sm leading-relaxed font-light text-text-secondary">
        {message}
        <br />
        Please check your details and try again.
      </p>
      <div className="mt-6">
        <Button type="button" onClick={onRetry} className="w-full">
          Try again
        </Button>
      </div>
    </div>
  );
}
