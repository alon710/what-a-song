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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-gray-700"
          disabled={isPending}
        >
          <Globe className="h-4 w-4" />
          <span>{getCurrentLanguageName()}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={locale} onValueChange={switchLocale}>
          <DropdownMenuRadioItem value="he">
            עברית (Hebrew)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
