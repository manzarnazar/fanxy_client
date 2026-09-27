/**
 * Design tokens extracted from the Claude Design "Fanxy splash screen" project
 * (00_web_design_system.dc.html, 02_login.dc.html). Cyan is primary across every
 * surface; rose, gold and purple are reserved for accents and gradient moments.
 * Never introduce colors outside this set — regenerate from the source design instead.
 */

export const colors = {
  dark: {
    primary: "#00AFF0",
    primaryLight: "#7fd4f5",
    primaryDark: "#0085c7",
    primaryMuted: "#0b3550",

    secondary: "#E21D5B",
    secondaryLight: "#ff5b78",
    secondaryDark: "#c2185b",

    accentGold: "#c99a2e",
    accentGoldLight: "#f5da8f",
    accentPurple: "#6a3fd0",
    accentPurpleLight: "#c1a3ff",

    background: "#03101a",
    surface: "#061826",
    surfaceElevated: "#06141f",
    border: "#123a4d",

    textPrimary: "#eaf8ff",
    textSecondary: "#bde5f5",
    textMuted: "#6f96ab",
    placeholder: "#5c7f92",

    success: "#7fe6a5",
    successStrong: "#2fae74",
    warning: "#f5da8f",
    warningStrong: "#c99a2e",
    danger: "#ff5b78",
    dangerStrong: "#c2185b",
    info: "#7fd4f5",
    live: "#ff4058",
  },
  light: {
    primary: "#0085c7",
    primaryLight: "#00AFF0",
    primaryDark: "#0b3550",
    primaryMuted: "#d5f2ff",

    secondary: "#c2185b",
    secondaryLight: "#e2455f",
    secondaryDark: "#8f1044",

    accentGold: "#a87c1f",
    accentGoldLight: "#c99a2e",
    accentPurple: "#6a3fd0",
    accentPurpleLight: "#8a5fe0",

    background: "#f6fafc",
    surface: "#ffffff",
    surfaceElevated: "#eef6fa",
    border: "#dbe7ee",

    textPrimary: "#0b1720",
    textSecondary: "#45606d",
    textMuted: "#7b93a0",
    placeholder: "#a3b7c1",

    success: "#2fae74",
    successStrong: "#1f8a5a",
    warning: "#a87c1f",
    warningStrong: "#8a6519",
    danger: "#c2185b",
    dangerStrong: "#8f1044",
    info: "#0085c7",
    live: "#ff4058",
  },
} as const;

export type ThemeMode = keyof typeof colors;
export type ColorToken = keyof typeof colors.dark;
