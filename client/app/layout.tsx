/** @format */
/* eslint-disable @next/next/no-head-element */
import type { Metadata } from "next";
import "./styles/globals.css";
import { StoreProviders } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import BaseLayout from "../components/layout/BaseLayout";

export const metadata: Metadata = {
  title: "ViaVai | Tieni traccia del tuo lavoro!",
  description:
    "ViaVai è un'app che ti permette di tenere traccia del tuo lavoro in modo semplice e veloce.",
  icons: {
    icon: [
      {
        url: "/images/favicons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/favicons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/favicons/apple-touch-icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/images/favicons/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/images/favicons/apple-touch-icon-57x57.png", sizes: "57x57" },
      { url: "/images/favicons/apple-touch-icon-60x60.png", sizes: "60x60" },
      { url: "/images/favicons/apple-touch-icon-72x72.png", sizes: "72x72" },
      { url: "/images/favicons/apple-touch-icon-76x76.png", sizes: "76x76" },
      {
        url: "/images/favicons/apple-touch-icon-114x114.png",
        sizes: "114x114",
      },
      {
        url: "/images/favicons/apple-touch-icon-120x120.png",
        sizes: "120x120",
      },
      {
        url: "/images/favicons/apple-touch-icon-144x144.png",
        sizes: "144x144",
      },
      {
        url: "/images/favicons/apple-touch-icon-152x152.png",
        sizes: "152x152",
      },
      {
        url: "/images/favicons/apple-touch-icon-180x180.png",
        sizes: "180x180",
      },
    ],
  },
  themeColor: "#ffffff",
  other: {
    "msapplication-TileColor": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProviders>
            <BaseLayout>{children}</BaseLayout>
          </StoreProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
