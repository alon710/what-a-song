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
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-4">
            <Logo />
            <NavTitle />
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t("admin")}
              </Button>
            </Link>
          </div>

          {/* Right side - Language Switcher */}
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t("admin")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
