import { AtSign, CheckCircle2, Image as ImageIcon, Link2, PlaySquare, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { UpdateProfileInput } from "@/features/settings/types/settings.types";

interface SocialFieldDef {
  key: keyof Pick<UpdateProfileInput, "instagramUrl" | "facebookUrl" | "twitterUrl" | "youtubeUrl">;
  label: string;
  icon: LucideIcon;
  /** Brand-tinted 32px icon tile per the design (Instagram pink, Facebook cyan, ...). */
  tileClassName: string;
  placeholder: string;
}

const SOCIAL_FIELDS: SocialFieldDef[] = [
  {
    key: "instagramUrl",
    label: "Instagram",
    icon: ImageIcon,
    tileClassName: "bg-secondary/14 text-[#ff9caa]",
    placeholder: "https://instagram.com/username",
  },
  {
    key: "facebookUrl",
    label: "Facebook",
    icon: Users,
    tileClassName: "bg-primary/14 text-primary-light",
    placeholder: "https://facebook.com/username",
  },
  {
    key: "twitterUrl",
    label: "X (Twitter)",
    icon: AtSign,
    tileClassName: "bg-text-secondary/10 text-[#cfeaf8]",
    placeholder: "https://x.com/username",
  },
  {
    key: "youtubeUrl",
    label: "YouTube",
    icon: PlaySquare,
    tileClassName: "bg-danger/14 text-[#ff9caa]",
    placeholder: "https://youtube.com/@username",
  },
];

interface SettingsSocialLinksFormProps {
  form: UpdateProfileInput;
  onFieldChange: <TKey extends keyof UpdateProfileInput>(key: TKey, value: UpdateProfileInput[TKey]) => void;
}

export function SettingsSocialLinksForm({ form, onFieldChange }: SettingsSocialLinksFormProps) {
  return (
    <div className="rounded-[22px] border border-primary/14 bg-surface/50 p-6">
      <div className="mb-4.5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/14 text-primary-light">
          <Link2 className="h-[21px] w-[21px]" aria-hidden="true" />
        </span>
        <div>
          <div className="font-display text-[21px] leading-none font-semibold text-text-primary">Social Links</div>
          <div className="mt-1 font-sans text-[12px] font-light text-text-secondary/60">
            Connect your social profiles to grow your reach.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SOCIAL_FIELDS.map((field) => {
          const filled = form[field.key].length > 0;
          return (
            <div
              key={field.key}
              className={cn(
                "flex h-[52px] items-center gap-2.5 rounded-[13px] border bg-surface-elevated/60 px-2.5 transition-colors",
                filled ? "border-primary/30" : "border-primary/14",
              )}
            >
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]", field.tileClassName)}>
                <field.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-sans text-[10px] font-medium text-text-secondary/55">{field.label}</div>
                <input
                  value={form[field.key]}
                  onChange={(event) => onFieldChange(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  aria-label={field.label}
                  className="w-full bg-transparent font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
                />
              </div>
              {filled && <CheckCircle2 className="h-[17px] w-[17px] shrink-0 text-success" aria-hidden="true" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
