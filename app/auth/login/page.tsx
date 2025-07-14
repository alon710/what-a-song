"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/shared/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { LogIn, Music } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push("/admin");
    } catch (error) {
      console.error("Login error:", error);
      setError(getErrorMessage(error instanceof Error ? error.message : ""));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return t("errors.userNotFound");
      case "auth/wrong-password":
        return t("errors.wrongPassword");
      case "auth/invalid-email":
        return t("errors.invalidEmail");
      case "auth/too-many-requests":
        return t("errors.tooManyRequests");
      default:
        return t("errors.loginFailed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Music className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">🎵 איזה שיר</h1>
          </div>
          <p className="text-gray-600">{t("adminLogin")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-start flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              {t("signIn")}
            </CardTitle>
            <CardDescription className="text-start">
              {t("enterCredentials")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <p className="text-red-800 text-sm">{error}</p>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-start">
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                  className="text-start"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-start">
                  {t("password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  required
                  className="text-start"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("signingIn") : t("signIn")}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t text-center space-y-2">
              <p className="text-sm text-gray-600">
                {t("dontHaveAccount")}{" "}
                <Link
                  href="/auth/signup"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {t("signUp")}
                </Link>
              </p>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 text-sm block"
              >
                ← {t("backToGame")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
