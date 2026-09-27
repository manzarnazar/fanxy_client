import { Ban, Grid3x3, HelpCircle, Info, LayoutGrid, LogOut, User, Wallet, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { SettingsSectionGroup, SettingsSectionKey } from "@/features/settings/types/settings.types";

export interface SettingsSectionMeta {
  group: SettingsSectionGroup;
  label: string;
  description: string;
}

export const SETTINGS_SECTION_META: Record<SettingsSectionKey, SettingsSectionMeta> = {
  profile: { group: "Account", label: "Profile", description: "Your public profile and personal details" },
  account: { group: "Account", label: "Account information", description: "Read-only details about your account" },
  creator: { group: "Creator", label: "Creator", description: "Bank details, payouts and creator tools" },
  help: { group: "Support", label: "Help center", description: "Guides, legal pages and support links" },
  about: { group: "Support", label: "About", description: "App info and social links" },
  actions: { group: "Account", label: "Account actions", description: "Log out of your account" },
};

export interface SettingsNavItemDef {
  key: SettingsSectionKey;
  label: string;
  icon: LucideIcon;
  danger?: boolean;
  /** When set, the item navigates to this route instead of switching sections. */
  href?: string;
}

export interface SettingsNavGroupDef {
  group: SettingsSectionGroup;
  items: SettingsNavItemDef[];
}

export function getSettingsNavGroups(): SettingsNavGroupDef[] {
  return [
    {
      group: "Account",
      items: [
        { key: "profile", label: "Profile", icon: User },
        { key: "account", label: "Account information", icon: Info },
        { key: "account", label: "Blocked accounts", icon: Ban, href: ROUTES.BLOCKED_USERS },
      ],
    },
    {
      group: "Creator",
      items: [{ key: "creator", label: "Creator", icon: Wallet }],
    },
    {
      group: "Support",
      items: [
        { key: "help", label: "Help center", icon: HelpCircle },
        { key: "about", label: "About", icon: Info },
      ],
    },
    {
      group: "Account",
      items: [{ key: "actions", label: "Account actions", icon: LogOut, danger: true }],
    },
  ];
}

export interface SettingsLinkCardDef {
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const CREATOR_TOOLS_LINK_CARDS: SettingsLinkCardDef[] = [
  { label: "Creator dashboard", description: "Overview & insights", icon: LayoutGrid, href: ROUTES.CREATOR_DASHBOARD },
  { label: "My content", description: "Manage your posts & stories", icon: Grid3x3, href: ROUTES.MY_CONTENT },
];
