"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gamepad2, Settings } from "lucide-react";
import Logo from "./Logo";
import NavTitle from "./NavTitle";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function Navigation() {
  const t = useTranslations("nav");

  return (
    <nav className="w-full bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-4">
            <Logo />
            <NavTitle />
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/play">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-700"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                {t("play")}
              </Button>
            </Link>

            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-700"
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
        <div className="md:hidden mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <Link href="/play">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-700"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                {t("play")}
              </Button>
            </Link>

            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-700"
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
