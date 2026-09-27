import { ChevronRight } from "lucide-react";
import type { SettingsSectionMeta } from "@/features/settings/constants/settings";

interface SettingsSectionHeaderProps {
  meta: SettingsSectionMeta;
}

export function SettingsSectionHeader({ meta }: SettingsSectionHeaderProps) {
  return (
    <div className="mb-5">
      <div className="mb-1.5 flex items-center gap-1.5 font-sans text-[11.5px] font-medium text-text-secondary/55">
        <span>{meta.group}</span>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span>{meta.label}</span>
      </div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">{meta.label}</h1>
      <p className="mt-1.5 font-sans text-[13px] font-light text-text-secondary/75">{meta.description}</p>
    </div>
  );
}
