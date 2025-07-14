"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  const t = useTranslations("game");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">{t("title")}</h1>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/admin">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
              >
                {t("backToHome")}
              </Button>
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
