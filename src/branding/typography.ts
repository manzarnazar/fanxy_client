/**
 * Typography extracted from the Claude Design system.
 * Cormorant Garamond drives display copy and numerals; Jost drives UI and body text.
 */

export const typography = {
  fontFamily: {
    display: "var(--font-cormorant)",
    body: "var(--font-jost)",
  },
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
  },
  scale: {
    hero: {
      fontFamily: "display",
      weight: 600,
      size: "3.625rem",
      lineHeight: 1.02,
      letterSpacing: "-0.02em",
    },
    pageTitle: {
      fontFamily: "display",
      weight: 600,
      size: "2rem",
      lineHeight: 1,
      letterSpacing: "0",
    },
    section: {
      fontFamily: "display",
      weight: 600,
      size: "1.5rem",
      lineHeight: 1.1,
      letterSpacing: "0",
    },
    cardTitle: {
      fontFamily: "body",
      weight: 500,
      size: "1.0625rem",
      lineHeight: 1.3,
      letterSpacing: "0",
    },
    body: {
      fontFamily: "body",
      weight: 300,
      size: "0.9375rem",
      lineHeight: 1.65,
      letterSpacing: "0",
    },
    caption: {
      fontFamily: "body",
      weight: 300,
      size: "0.75rem",
      lineHeight: 1.5,
      letterSpacing: "0.02em",
    },
    button: {
      fontFamily: "body",
      weight: 600,
      size: "0.875rem",
      lineHeight: 1,
      letterSpacing: "0.02em",
    },
    numerals: {
      fontFamily: "display",
      weight: 600,
      size: "1.875rem",
      lineHeight: 1,
      letterSpacing: "0",
    },
  },
} as const;
