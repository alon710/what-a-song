"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/shared/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, userData, loading, isAdmin } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push("/auth/login");
        return;
      }

      if (requireAdmin && !isAdmin) {
        // Redirect to home if not admin
        router.push("/");
        return;
      }
    }
  }, [user, userData, loading, isAdmin, requireAdmin, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Shield className="w-8 h-8 animate-pulse mx-auto text-blue-600" />
          <p className="text-lg text-gray-800">{t("verifyingAccess")}</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-96">
          <CardContent className="p-6 text-center space-y-4">
            <Lock className="w-12 h-12 mx-auto text-red-500" />
            <h2 className="text-xl font-bold text-gray-800">
              {t("accessDenied")}
            </h2>
            <p className="text-gray-600">{t("loginRequired")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show admin access denied if admin required but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-96">
          <CardContent className="p-6 text-center space-y-4">
            <Shield className="w-12 h-12 mx-auto text-orange-500" />
            <h2 className="text-xl font-bold text-gray-800">
              {t("adminRequired")}
            </h2>
            <p className="text-gray-600">{t("adminAccessOnly")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}
