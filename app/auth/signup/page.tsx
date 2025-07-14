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
import { UserPlus, Music } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signUp(email, password, displayName || undefined);
      router.push("/");
    } catch (error) {
      setError(getErrorMessage(error instanceof Error ? error.message : ""));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    const errorMessages: { [key: string]: string } = {
      "auth/email-already-in-use": t("errors.emailAlreadyInUse"),
      "auth/invalid-email": t("errors.invalidEmail"),
      "auth/weak-password": t("errors.weakPassword"),
      "auth/too-many-requests": t("errors.tooManyRequests"),
    };

    return errorMessages[errorCode] || t("errors.signupFailed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">What A Song</h1>
          </div>
        </div>

        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserPlus className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl">{t("createAccount")}</CardTitle>
            </div>
            <CardDescription className="text-start">
              {t("enterSignupDetails")}
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

              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-start">
                  {t("displayName")}
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t("displayNamePlaceholder")}
                  className="text-start"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("signingUp") : t("signUp")}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t text-center space-y-2">
              <p className="text-sm text-gray-600">
                {t("alreadyHaveAccount")}{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {t("signIn")}
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
