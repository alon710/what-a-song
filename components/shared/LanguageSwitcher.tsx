"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTransition } from "react";

export default function LanguageSwitcher() {
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
    return lang === "he" ? "🇮🇱" : "🇺🇸";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-gray-700 h-8 touch-manipulation"
          disabled={isPending}
        >
          <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-12 min-w-0 p-1">
        <DropdownMenuItem
          onClick={() => switchLocale("he")}
          className="justify-center p-2 cursor-pointer focus:bg-accent"
        >
          {getLanguageWithFlag("he")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale("en")}
          className="justify-center p-2 cursor-pointer focus:bg-accent"
        >
          {getLanguageWithFlag("en")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
