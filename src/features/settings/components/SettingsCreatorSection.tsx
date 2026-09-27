import { BadgeCheck, Building2, Crown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SettingsCardGridSection } from "@/features/settings/components/SettingsCardGridSection";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { CREATOR_TOOLS_LINK_CARDS } from "@/features/settings/constants/settings";
import { useCreatorPayoutForm } from "@/features/settings/hooks/useCreatorPayoutForm";
import type { SettingsProfile } from "@/features/settings/types/settings.types";

interface SettingsCreatorSectionProps {
  profile: SettingsProfile;
}

export function SettingsCreatorSection({ profile }: SettingsCreatorSectionProps) {
  const payout = useCreatorPayoutForm(profile);

  return (
    <div className="flex flex-col gap-5">
      {profile.isCreator ? (
        <>
          <SettingsCardGridSection cards={CREATOR_TOOLS_LINK_CARDS} />

          {profile.bankName && (
            <div className="flex items-center gap-3.5 rounded-xl border border-primary/14 bg-surface/50 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary-light">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-sans text-[13.5px] font-medium text-text-primary">{profile.bankName}</div>
                <div className="font-sans text-[11.5px] font-light text-text-secondary/70">
                  {profile.accountNo ? `••••${profile.accountNo.slice(-4)}` : "—"}
                </div>
              </div>
              {profile.verified && (
                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-success/25 bg-success/12 px-3 py-1 font-sans text-[10.5px] font-medium text-success">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verified
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-secondary/25 bg-gradient-to-br from-secondary/14 to-surface/50 p-6.5">
          <div className="pointer-events-none absolute -top-14 -right-8 h-56 w-56 rounded-full bg-secondary/22 blur-2xl" aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-3.5">
            <span className="flex h-13 w-13 items-center justify-center rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark text-white">
              <Crown className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="font-display text-[26px] font-semibold text-text-primary">Become a Creator</div>
            <p className="max-w-[440px] font-sans text-[13.5px] leading-relaxed font-light text-text-secondary/80">
              Submit your bank details and ID proof below to start earning through subscriptions, live streaming and gifts.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-primary/14 bg-surface/50 p-5.5">
        <div className="mb-4 font-sans text-[13.5px] font-medium text-text-primary">
          {profile.isCreator ? "Update payout details" : "Bank & ID details"}
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block px-1 font-sans text-[10px] font-medium tracking-wider text-text-muted uppercase">
                Bank name
              </label>
              <input
                value={payout.form.bankName}
                onChange={(event) => payout.setField("bankName", event.target.value)}
                className="w-full rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5 font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
              />
            </div>
            <div>
              <label className="mb-1.5 block px-1 font-sans text-[10px] font-medium tracking-wider text-text-muted uppercase">
                Account number
              </label>
              <input
                value={payout.form.accountNo}
                onChange={(event) => payout.setField("accountNo", event.target.value)}
                className="w-full rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5 font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
              />
            </div>
            <div>
              <label className="mb-1.5 block px-1 font-sans text-[10px] font-medium tracking-wider text-text-muted uppercase">
                IFSC code
              </label>
              <input
                value={payout.form.ifscNo}
                onChange={(event) => payout.setField("ifscNo", event.target.value)}
                className="w-full rounded-md border border-primary/16 bg-surface/60 px-3.5 py-2.5 font-sans text-[13px] text-text-primary outline-none placeholder:text-placeholder"
              />
            </div>
          </div>

          <ImageUploadField
            label="ID proof — front"
            file={payout.form.frontIdProofFile}
            onChange={(file) => payout.setField("frontIdProofFile", file)}
          />
          <ImageUploadField
            label="ID proof — back"
            file={payout.form.backIdProofFile}
            onChange={(file) => payout.setField("backIdProofFile", file)}
          />

          <button
            type="button"
            onClick={payout.submit}
            disabled={payout.saving}
            className={cn(
              "mt-1.5 flex items-center justify-center gap-2 rounded-md py-3.5 font-sans text-[13.5px] font-semibold text-white transition",
              payout.saving ? "cursor-not-allowed bg-secondary/40" : "bg-gradient-to-br from-secondary-light to-secondary-dark hover:-translate-y-0.5",
            )}
          >
            {payout.saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {profile.isCreator ? "Save payout details" : "Apply now"}
          </button>
        </div>
      </div>
    </div>
  );
}
