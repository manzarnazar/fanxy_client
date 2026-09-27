import Image from "next/image";
import { Share2 } from "lucide-react";
import type { SettingsSocialLink } from "@/features/settings/types/settings.types";

interface SettingsAboutSectionProps {
  socialLinks: SettingsSocialLink[];
}

export function SettingsAboutSection({
  socialLinks,
}: SettingsAboutSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center rounded-xl border border-primary/14 bg-surface/50 p-6.5 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-md bg-gradient-to-br from-primary-light to-primary font-display text-2xl font-semibold text-[#052433]">
          D
        </span>
        <div className="mt-3 font-display text-xl font-semibold text-text-primary">
          Fanxy
        </div>
      </div>

      {socialLinks.length > 0 && (
        <div className="rounded-xl border border-primary/14 bg-surface/50 px-5">
          {socialLinks.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                index !== socialLinks.length - 1
                  ? "flex w-full items-center gap-3 border-b border-primary/8 py-3.5 text-left"
                  : "flex w-full items-center gap-3 py-3.5 text-left"
              }
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary/12 text-primary-light">
                {link.imageUrl ? (
                  <Image
                    src={link.imageUrl}
                    alt=""
                    width={18}
                    height={18}
                    className="h-4.5 w-4.5 object-contain"
                  />
                ) : (
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                )}
              </span>
              <span className="font-sans text-[13.5px] font-normal text-text-primary">
                {link.name}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
