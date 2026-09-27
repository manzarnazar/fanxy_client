import { SettingsReadOnlyRow } from "@/features/settings/components/SettingsReadOnlyRow";
import type { SettingsProfile } from "@/features/settings/types/settings.types";

interface SettingsAccountInfoSectionProps {
  profile: SettingsProfile;
}

export function SettingsAccountInfoSection({ profile }: SettingsAccountInfoSectionProps) {
  return (
    <div className="rounded-xl border border-primary/14 bg-surface/50 px-5 py-1.5">
      <SettingsReadOnlyRow label="Account ID" value={profile.id} />
      <SettingsReadOnlyRow label="Member since" value={profile.memberSinceLabel} />
      <SettingsReadOnlyRow
        label="Account type"
        value={profile.isCreator ? "Creator" : "Member"}
        valueClassName="text-primary-light"
      />
      <SettingsReadOnlyRow
        label="Verification"
        value={profile.verified ? "Verified" : "Not verified"}
        valueClassName={profile.verified ? "text-success" : "text-text-secondary/70"}
        showDot={profile.verified}
      />
      <SettingsReadOnlyRow label="Wallet balance" value={String(profile.walletBalance)} />
      <SettingsReadOnlyRow label="Coin balance" value={String(profile.coinBalance)} />
      <SettingsReadOnlyRow label="Earned coins" value={String(profile.earnedCoins)} divider={false} />
    </div>
  );
}
