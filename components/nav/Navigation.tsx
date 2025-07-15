"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, LogIn, LogOut, Shield, History } from "lucide-react";
import { useAuth } from "@/components/shared/AuthProvider";
import Logo from "./Logo";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

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
            <Link href="/history">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3"
              >
                <History className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline sm:inline">
                  {t("history")}
                </span>
              </Button>
            </Link>

            {/* Admin Panel Link - Only show to admins */}
            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline sm:inline">
                    {t("admin")}
                  </span>
                  <span className="xs:hidden sm:hidden">{t("admin")}</span>
                </Button>
              </Link>
            )}

            {/* Authentication Status */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    {/* User Info */}
                    <div className="hidden sm:flex items-center gap-1 text-xs text-gray-600">
                      {isAdmin && <Shield className="w-3 h-3 text-blue-600" />}
                      <span>{userData?.displayName || userData?.email}</span>
                    </div>

                    {/* Logout Button */}
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      size="sm"
                      className="text-gray-700 hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline sm:inline">
                        {t("signOut")}
                      </span>
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-700 hover:bg-gray-100 text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline sm:inline">
                        {t("signIn")}
                      </span>
                    </Button>
                  </Link>
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
