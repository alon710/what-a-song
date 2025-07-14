"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("shared.languages");
  const tNav = useTranslations("shared");
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      // Store the selected locale in localStorage
      localStorage.setItem("preferred-locale", newLocale);

      // Update document direction immediately for better UX
      const isRTL = newLocale === "he";
      const html = document.documentElement;
      html.setAttribute("lang", newLocale);
      html.setAttribute("dir", isRTL ? "rtl" : "ltr");

      // Refresh the page to apply the new locale
      window.location.reload();
    });
  };

  const getCurrentLanguageName = () => {
    return locale === "he" ? t("hebrew") : t("english");
  };

  const getCurrentLanguageShort = () => {
    return locale === "he" ? "עב" : "EN";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 sm:gap-2 text-gray-700 h-8 px-2 sm:px-3 text-xs sm:text-sm min-w-[44px] touch-manipulation"
          disabled={isPending}
        >
          <Globe className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          {/* Show short version on very small screens, full name on larger screens */}
          <span className="hidden xs:inline sm:inline">
            {getCurrentLanguageName()}
          </span>
          <span className="xs:hidden sm:hidden">
            {getCurrentLanguageShort()}
          </span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] sm:w-[180px]">
        <DropdownMenuLabel className="text-sm">
          {tNav("selectLanguage")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={locale} onValueChange={switchLocale}>
          <DropdownMenuRadioItem
            value="he"
            className="text-sm py-2.5 cursor-pointer touch-manipulation"
          >
            {tNav("hebrewOption")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="en"
            className="text-sm py-2.5 cursor-pointer touch-manipulation"
          >
            {tNav("englishOption")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
