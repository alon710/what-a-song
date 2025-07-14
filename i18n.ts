import { getRequestConfig } from "next-intl/server";

export const locales = ["he", "en"] as const;
export const defaultLocale = "he" as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Ensure we always have a valid locale
  let validLocale: string = defaultLocale;

  if (locale && typeof locale === "string" && locales.includes(locale as any)) {
    validLocale = locale;
  }

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
