"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
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

      // Add/remove RTL class for additional styling support
      if (isRTL) {
        html.classList.add("rtl");
        html.classList.remove("ltr");
      } else {
        html.classList.add("ltr");
        html.classList.remove("rtl");
      }

      // Refresh the page to apply the new locale
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <div className="flex gap-1">
        <Button
          variant={locale === "he" ? "default" : "outline"}
          size="sm"
          onClick={() => switchLocale("he")}
          disabled={isPending}
        >
          עב
        </Button>
        <Button
          variant={locale === "en" ? "default" : "outline"}
          size="sm"
          onClick={() => switchLocale("en")}
          disabled={isPending}
        >
          EN
        </Button>
      </div>
    </div>
  );
}
