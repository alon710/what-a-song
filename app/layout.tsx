import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LocaleProvider from "@/components/shared/LocaleProvider";
import Navigation from "@/components/nav/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🎵 איזה שיר - What a Song",
  description: "משחק ניחוש שירים מתורגמים - Lyric Translation Guessing Game",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load both Hebrew and English messages
  const hebrewMessages = (await import("../messages/he.json")).default;
  const englishMessages = (await import("../messages/en.json")).default;

  return (
    <html lang="he" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider
          hebrewMessages={hebrewMessages}
          englishMessages={englishMessages}
        >
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            <Navigation />
            <main>{children}</main>
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
