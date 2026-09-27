import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { BecomeCreatorStep } from "@/features/become-creator/hooks/useBecomeCreatorWizard";

const STEPS: Array<{ key: BecomeCreatorStep; label: string; sublabel: string }> = [
  { key: "benefits", label: "Benefits", sublabel: "Get started" },
  { key: "bank", label: "Bank", sublabel: "Payouts" },
  { key: "identity", label: "Identity", sublabel: "Verify" },
  { key: "review", label: "Review", sublabel: "Submit" },
];

interface BecomeCreatorStepperProps {
  step: BecomeCreatorStep;
  onStepClick: (step: BecomeCreatorStep) => void;
}

export function BecomeCreatorStepper({ step, onStepClick }: BecomeCreatorStepperProps) {
  if (step === "success") return null;
  const activeIndex = STEPS.findIndex((item) => item.key === step);

  return (
    <div className="mb-7 flex items-start justify-center gap-2">
      {STEPS.map((item, index) => {
        const isDone = index < activeIndex;
        const isActive = index === activeIndex;
        return (
          <div key={item.key} className="flex items-start gap-2">
            <button type="button" disabled={!isDone} onClick={() => onStepClick(item.key)} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border font-sans text-[12.5px] font-semibold transition",
                  isActive
                    ? "border-transparent bg-gradient-to-br from-primary-light to-primary text-[#03283a] shadow-glow"
                    : isDone
                      ? "border-primary/32 bg-primary/14 text-primary-light"
                      : "border-primary/16 bg-surface/60 text-text-secondary/60",
                )}
              >
                {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
              </span>
              <span className="hidden flex-col items-center sm:flex">
                <span className={cn("font-sans text-[11.5px] font-semibold", isActive ? "text-text-primary" : "text-text-secondary/70")}>
                  {item.label}
                </span>
                <span className="font-sans text-[9.5px] font-light text-text-secondary/50">{item.sublabel}</span>
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <span className={cn("mt-4.5 h-0.5 w-10 rounded-full sm:w-14", isDone ? "bg-primary/50" : "bg-primary/12")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
