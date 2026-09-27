import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { StoreProvider } from "@/providers/StoreProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { FirstVisitGate } from "@/components/shared/FirstVisitGate";
import { STORAGE_KEYS } from "@/lib/constants/keys";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "yourappname",
  description: "The premium creator platform.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: `${BASE_PATH}/favicon-16x16.png`,
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/favicon-32x32.png`,
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/favicon-96x96.png`,
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/android-icon-192x192.png`,
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: `${BASE_PATH}/apple-icon-57x57.png`,
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/apple-icon-60x60.png`,
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/apple-icon-72x72.png`,
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/apple-icon-76x76.png`,
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/apple-icon-114x114.png`,
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/apple-icon-120x120.png`,
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/apple-icon-144x144.png`,
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/apple-icon-152x152.png`,
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: `${BASE_PATH}/apple-icon-180x180.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: `${BASE_PATH}/favicon.ico`,
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: `${BASE_PATH}/apple-icon-precomposed.png`,
      },
    ],
  },
  other: {
    "msapplication-TileImage": `${BASE_PATH}/ms-icon-144x144.png`,
    "msapplication-config": `${BASE_PATH}/browserconfig.xml`,
  },
};

const THEME_INIT_SCRIPT = `(function () {
  try {
    var mode = localStorage.getItem("${STORAGE_KEYS.THEME_MODE}") || "system";
    var theme = mode === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : mode;
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${cormorantGaramond.variable} ${jost.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <StoreProvider>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                <FirstVisitGate>{children}</FirstVisitGate>
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
