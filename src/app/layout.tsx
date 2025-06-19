import type { Metadata } from "next";
import { Geist, Geist_Mono, Pirata_One } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pirataOne = Pirata_One({
  variable: "--font-pirata-one",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Panache.social",
    template: "%s | Panache.social",
  },
  description:
    "An open-source alternative to Reddit. Powered by the community.",
  keywords: [
    "social media",
    "reddit alternative",
    "open source",
    "community",
    "discussion",
  ],
  authors: [{ name: "Alexis Bouchez" }],
  creator: "Alexis Bouchez",
  publisher: "Panache.social",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://panache.social"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://panache.social",
    title: "Panache.social",
    description:
      "An open-source alternative to Reddit. Powered by the community.",
    siteName: "Panache.social",
  },
  twitter: {
    card: "summary_large_image",
    title: "Panache.social",
    description:
      "An open-source alternative to Reddit. Powered by the community.",
    creator: "@alexisbchz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pirataOne.variable} antialiased [--header-height:calc(--spacing(14))]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Analytics />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
