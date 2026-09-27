import { SettingsProfileHeaderCard } from "@/features/settings/components/SettingsProfileHeaderCard";
import { SettingsPersonalInfoForm } from "@/features/settings/components/SettingsPersonalInfoForm";
import { SettingsSocialLinksForm } from "@/features/settings/components/SettingsSocialLinksForm";
import { SettingsProfilePreview } from "@/features/settings/components/SettingsProfilePreview";
import { SettingsSaveBar } from "@/features/settings/components/SettingsSaveBar";
import { useProfileEditor } from "@/features/settings/hooks/useProfileEditor";
import type { SettingsProfile } from "@/features/settings/types/settings.types";

interface SettingsProfileSectionProps {
  profile: SettingsProfile;
}

export function SettingsProfileSection({ profile }: SettingsProfileSectionProps) {
  const editor = useProfileEditor(profile);

  return (
    // The settings page already has nav + info side columns — the preview only
    // splits off at 2xl where the center column is genuinely wide enough.
    <div className="grid grid-cols-1 items-start gap-4.5 2xl:grid-cols-[1fr_300px]">
      <div className="flex min-w-0 flex-col gap-4.5">
        <SettingsProfileHeaderCard
          profile={profile}
          avatarPreviewUrl={editor.avatarPreviewUrl}
          coverPreviewUrl={editor.coverPreviewUrl}
          onAvatarChange={(file) => editor.setField("avatarFile", file)}
          onCoverChange={(file) => editor.setField("coverFile", file)}
        />

        <SettingsPersonalInfoForm form={editor.form} onFieldChange={editor.setField} />

        <SettingsSocialLinksForm form={editor.form} onFieldChange={editor.setField} />
      </div>

      <div className="hidden 2xl:sticky 2xl:top-4 2xl:block">
        <SettingsProfilePreview
          profile={profile}
          form={editor.form}
          avatarPreviewUrl={editor.avatarPreviewUrl}
          coverPreviewUrl={editor.coverPreviewUrl}
        />
      </div>

      {editor.dirty && <SettingsSaveBar saving={editor.saving} onDiscard={editor.discard} onSave={editor.save} />}
    </div>
  );
}
