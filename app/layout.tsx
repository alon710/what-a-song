import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LocaleProvider from "@/components/shared/LocaleProvider";
import AuthProvider from "@/components/shared/AuthProvider";
import Navigation from "@/components/nav/Navigation";
import { StagewiseToolbar } from "@stagewise/toolbar-next";
import ReactPlugin from "@stagewise-plugins/react";
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
  title: "איזה שיר - What a Song",
  description: "משחק ניחוש שירים מתורגמים - Lyric Translation Guessing Game",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hebrewMessages = (await import("../messages/he.json")).default;
  const englishMessages = (await import("../messages/en.json")).default;

  return (
    <LocaleProvider
      hebrewMessages={hebrewMessages}
      englishMessages={englishMessages}
    >
      <AuthProvider>
        <html
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <body>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
              <Navigation />
              <main className="flex-1 w-full overflow-x-hidden">
                {children}
              </main>
            </div>
            {process.env.NODE_ENV === "development" && (
              <StagewiseToolbar
                config={{
                  plugins: [ReactPlugin],
                }}
              />
            )}
          </body>
        </html>
      </AuthProvider>
    </LocaleProvider>
  );
}
