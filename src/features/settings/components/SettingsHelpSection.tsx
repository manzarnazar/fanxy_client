import Image from "next/image";
import { FileText } from "lucide-react";
import type { SettingsPage } from "@/features/settings/types/settings.types";

interface SettingsHelpSectionProps {
  pages: SettingsPage[];
}

export function SettingsHelpSection({ pages }: SettingsHelpSectionProps) {
  if (pages.length === 0) {
    return (
      <div className="rounded-xl border border-primary/14 bg-surface/50 p-6.5 text-center font-sans text-[13px] font-light text-text-secondary/70">
        No help pages available right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      {pages.map((page) => (
        <a
          key={page.key}
          href={page.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 rounded-xl border border-primary/14 bg-surface/50 p-4 text-left transition hover:-translate-y-1 hover:border-primary/35"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary/12 text-primary-light">
            {page.iconUrl ? (
              <Image src={page.iconUrl} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
            ) : (
              <FileText className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-sans text-[14.5px] font-medium text-text-primary">{page.title}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
