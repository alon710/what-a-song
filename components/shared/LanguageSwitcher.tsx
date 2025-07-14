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
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const tNav = useTranslations("shared");
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      localStorage.setItem("preferred-locale", newLocale);

      const isRTL = newLocale === "he";
      const html = document.documentElement;
      html.setAttribute("lang", newLocale);
      html.setAttribute("dir", isRTL ? "rtl" : "ltr");

      window.location.reload();
    });
  };

  const getLanguageWithFlag = (lang: string) => {
    return lang === "he" ? "🇮🇱 עברית" : "🇺🇸 English";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-gray-700 h-8 px-2 min-w-[44px] touch-manipulation"
          disabled={isPending}
        >
          <Globe className="h-4 w-4 flex-shrink-0" />
          <ChevronDown className="h-3 w-3 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px]">
        <DropdownMenuLabel className="text-sm">
          {tNav("selectLanguage")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={locale} onValueChange={switchLocale}>
          <DropdownMenuRadioItem
            value="he"
            className="text-sm py-2.5 cursor-pointer touch-manipulation"
          >
            {getLanguageWithFlag("he")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="en"
            className="text-sm py-2.5 cursor-pointer touch-manipulation"
          >
            {getLanguageWithFlag("en")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
