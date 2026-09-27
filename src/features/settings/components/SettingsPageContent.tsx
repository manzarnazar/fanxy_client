"use client";

import { useAppSelector } from "@/store/hooks";
import { SectionStateMessage } from "@/components/shared/SectionStateMessage";
import { ROUTES } from "@/lib/constants/routes";
import { useSettingsData } from "@/features/settings/hooks/useSettingsData";
import { useSettingsNav } from "@/features/settings/hooks/useSettingsNav";
import { useAccountActions } from "@/features/settings/hooks/useAccountActions";
import { SettingsSectionNav } from "@/features/settings/components/SettingsSectionNav";
import { SettingsSectionTabs } from "@/features/settings/components/SettingsSectionTabs";
import { SettingsSectionHeader } from "@/features/settings/components/SettingsSectionHeader";
import { SettingsSectionContent } from "@/features/settings/components/SettingsSectionContent";
import { SettingsRightProfileRail } from "@/features/settings/components/SettingsRightProfileRail";
import { SettingsLogoutModal } from "@/features/settings/components/SettingsLogoutModal";
import { SETTINGS_SECTION_META } from "@/features/settings/constants/settings";

export function SettingsPageContent() {
  const { user, isBootstrapped } = useAppSelector((state) => state.auth);
  const { bundle, status, error, retry } = useSettingsData();
  const nav = useSettingsNav();
  const accountActions = useAccountActions();

  // Settings are account-scoped — guests get a sign-in prompt, not an error.
  if (isBootstrapped && !user) {
    return (
      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5">
        <div className="mx-auto max-w-[720px]">
          <SectionStateMessage
            variant="empty"
            title="Sign in to manage settings"
            body="Your profile, preferences, and account options live in your account."
            emptyHref={ROUTES.SIGN_IN}
            emptyLabel="Sign In"
          />
        </div>
      </main>
    );
  }

  return (
    <>
      <SettingsSectionNav
        groups={nav.groups}
        activeSection={nav.activeSection}
        onSelect={nav.selectSection}
        query={nav.query}
        onQueryChange={nav.setQuery}
      />

      <main className="min-w-0 flex-1 overflow-y-auto px-6.5 py-5.5 pb-[100px] lg:pb-5.5">
        <div className="mx-auto ">
          <SettingsSectionTabs groups={nav.groups} activeSection={nav.activeSection} onSelect={nav.selectSection} />

          {status === "loading" && !bundle && (
            <div className="flex min-h-[50vh] items-center justify-center font-sans text-sm text-text-secondary">
              Loading settings…
            </div>
          )}

          {status === "failed" && !bundle && (
            <SectionStateMessage
              variant="error"
              title="Couldn't load settings"
              body={error ?? "Something went wrong. Please try again."}
              onRetry={retry}
              minHeightClassName="min-h-[50vh]"
            />
          )}

          {bundle && (
            <>
              <SettingsSectionHeader meta={SETTINGS_SECTION_META[nav.activeSection]} />
              <SettingsSectionContent section={nav.activeSection} bundle={bundle} onOpenLogout={accountActions.openLogout} />
            </>
          )}
        </div>
      </main>

      {bundle && <SettingsRightProfileRail profile={bundle.profile} />}

      <SettingsLogoutModal open={accountActions.logoutOpen} onClose={accountActions.closeLogout} onConfirm={accountActions.confirmLogout} />
    </>
  );
}
