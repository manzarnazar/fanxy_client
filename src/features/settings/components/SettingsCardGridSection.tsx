import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SettingsLinkCardDef } from "@/features/settings/constants/settings";

interface SettingsCardGridSectionProps {
  cards: SettingsLinkCardDef[];
}

export function SettingsCardGridSection({ cards }: SettingsCardGridSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className="flex items-center gap-3.5 rounded-xl border border-primary/14 bg-surface/50 p-4 text-left transition hover:-translate-y-1 hover:border-primary/35"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary-light">
            <card.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-sans text-[14.5px] font-medium text-text-primary">{card.label}</div>
            <div className="font-sans text-[11.5px] font-light text-text-secondary/70">{card.description}</div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-text-secondary/45" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
