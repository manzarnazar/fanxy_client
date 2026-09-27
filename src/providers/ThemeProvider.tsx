"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setThemeMode, type ThemeMode } from "@/store/slices/uiSlice";
import { STORAGE_KEYS } from "@/lib/constants/keys";

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME_MODE) as ThemeMode | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      dispatch(setThemeMode(stored));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, themeMode);
    document.documentElement.setAttribute("data-theme", resolveTheme(themeMode));

    if (themeMode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      document.documentElement.setAttribute("data-theme", resolveTheme("system"));
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeMode]);

  return <>{children}</>;
}
