import type { Metadata } from "next";
import { Geist, Geist_Mono, Pirata_One } from "next/font/google";
import "./globals.css";

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
  title: "Panache",
  description:
    "An open-source alternative to Reddit. Powered by the community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pirataOne.variable} antialiased [--header-height:calc(--spacing(14))]`}
      >
        {children}
      </body>
    </html>
  );
}
