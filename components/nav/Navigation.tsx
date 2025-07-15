"use client";

import { useTranslations } from "next-intl";
import { Settings, User, LogOut, History, Calendar } from "lucide-react";
import { useAuth } from "@/components/shared/AuthProvider";
import Logo from "@/components/nav/Logo";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import NavbarButton from "@/components/nav/NavbarButton";

export default function Navigation() {
  const t = useTranslations("nav");
  const { user, userData, isAdmin, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Show icon only on mobile, icon with text on larger screens */}
            <div className="block sm:hidden">
              <Logo href="/" variant="icon-only" size="sm" />
            </div>
            <div className="hidden sm:block">
              <Logo href="/" variant="icon-only" size="md" />
            </div>
          </div>

          {/* Right side - Navigation and Auth */}
          <div className="flex items-center gap-2">
            {/* History Link */}
            <NavbarButton icon={History} text={t("history")} href="/history" />
            <NavbarButton icon={Calendar} text={t("daily")} href="/" />

            {/* Admin Panel Link - Only show to admins */}
            {isAdmin && (
              <NavbarButton icon={Settings} text={t("admin")} href="/admin" />
            )}

            {/* Authentication Status */}
            {!loading && (
              <>
                {user ? (
                  <NavbarButton
                    icon={LogOut}
                    text={t("signOut")}
                    onClick={handleLogout}
                  />
                ) : (
                  <NavbarButton
                    icon={User}
                    text={t("signIn")}
                    href="/auth/login"
                  />
                )}
              </>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
