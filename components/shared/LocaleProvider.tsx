"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";

interface LocaleProviderProps {
  children: React.ReactNode;
  hebrewMessages: Record<string, unknown>;
  englishMessages: Record<string, unknown>;
}

export default function LocaleProvider({
  children,
  hebrewMessages,
  englishMessages,
}: LocaleProviderProps) {
  const [locale, setLocale] = useState("he");
  const [messages, setMessages] = useState(hebrewMessages);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for stored locale preference
    const storedLocale = localStorage.getItem("preferred-locale");
    const currentLocale =
      storedLocale && (storedLocale === "he" || storedLocale === "en")
        ? storedLocale
        : "he";

    setLocale(currentLocale);
    setMessages(currentLocale === "he" ? hebrewMessages : englishMessages);

    // Update document attributes for RTL/LTR
    updateDocumentDirection(currentLocale);
  }, [hebrewMessages, englishMessages]);

  const updateDocumentDirection = (currentLocale: string) => {
    const isRTL = currentLocale === "he";
    const html = document.documentElement;

    html.setAttribute("lang", currentLocale);
    html.setAttribute("dir", isRTL ? "rtl" : "ltr");

    // Add/remove RTL class for additional styling support
    if (isRTL) {
      html.classList.add("rtl");
      html.classList.remove("ltr");
    } else {
      html.classList.add("ltr");
      html.classList.remove("rtl");
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <NextIntlClientProvider
        messages={hebrewMessages}
        locale="he"
        timeZone="UTC"
      >
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}
