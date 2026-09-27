import { SettingsProfileSection } from "@/features/settings/components/SettingsProfileSection";
import { SettingsAccountInfoSection } from "@/features/settings/components/SettingsAccountInfoSection";
import { SettingsCreatorSection } from "@/features/settings/components/SettingsCreatorSection";
import { SettingsHelpSection } from "@/features/settings/components/SettingsHelpSection";
import { SettingsAboutSection } from "@/features/settings/components/SettingsAboutSection";
import { SettingsAccountActionsSection } from "@/features/settings/components/SettingsAccountActionsSection";
import type { SettingsBundle, SettingsSectionKey } from "@/features/settings/types/settings.types";

interface SettingsSectionContentProps {
  section: SettingsSectionKey;
  bundle: SettingsBundle;
  onOpenLogout: () => void;
}

export function SettingsSectionContent({ section, bundle, onOpenLogout }: SettingsSectionContentProps) {
  switch (section) {
    case "profile":
      return <SettingsProfileSection profile={bundle.profile} />;
    case "account":
      return <SettingsAccountInfoSection profile={bundle.profile} />;
    case "creator":
      return <SettingsCreatorSection profile={bundle.profile} />;
    case "help":
      return <SettingsHelpSection pages={bundle.pages} />;
    case "about":
      return <SettingsAboutSection socialLinks={bundle.socialLinks} />;
    case "actions":
      return <SettingsAccountActionsSection onOpenLogout={onOpenLogout} />;
    default:
      return null;
  }
}
