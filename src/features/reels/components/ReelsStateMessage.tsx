import { Clapperboard } from "lucide-react";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";

interface ReelsStateMessageProps {
  variant: "empty" | "error";
  title: string;
  body: string;
  onRetry?: () => void;
}

export function ReelsStateMessage({ variant, title, body, onRetry }: ReelsStateMessageProps) {
  return (
    <SectionStateMessage
      variant={variant}
      title={title}
      body={body}
      onRetry={onRetry}
      icon={Clapperboard}
      minHeightClassName="min-h-[560px]"
    />
  );
}
