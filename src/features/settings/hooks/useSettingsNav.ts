"use client";

import { useMemo, useState } from "react";
import { getSettingsNavGroups } from "@/features/settings/constants/settings";
import type { SettingsSectionKey } from "@/features/settings/types/settings.types";

export function useSettingsNav(initialSection: SettingsSectionKey = "profile") {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState<SettingsSectionKey>(initialSection);
  const [mobileOpen, setMobileOpen] = useState(false);

  const allGroups = useMemo(() => getSettingsNavGroups(), []);

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return allGroups;
    return allGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(normalized)),
      }))
      .filter((group) => group.items.length > 0);
  }, [allGroups, query]);

  const selectSection = (key: SettingsSectionKey) => {
    setActiveSection(key);
    setMobileOpen(false);
  };

  return {
    query,
    setQuery,
    groups: filteredGroups,
    activeSection,
    selectSection,
    mobileOpen,
    toggleMobile: () => setMobileOpen((prev) => !prev),
    closeMobile: () => setMobileOpen(false),
  };
}
