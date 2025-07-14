"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Logo from "./Logo";
import NavTitle from "./NavTitle";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function Navigation() {
  const t = useTranslations("nav");

  return (
    <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Logo />
          </div>

          {/* Right side - Navigation and Language Switcher */}
          <div className="flex items-center gap-2">
            {/* Admin link - always visible but smaller on mobile */}
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline sm:inline">{t("admin")}</span>
                <span className="xs:hidden sm:hidden">Admin</span>
              </Button>
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
