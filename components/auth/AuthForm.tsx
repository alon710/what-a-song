"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/shared/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  const isLogin = mode === "login";
  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        router.push("/admin");
      } else {
        await signUp(email, password, displayName || undefined);
        router.push("/");
      }
    } catch (error) {
      console.error(`${mode} error:`, error);
      setError(getErrorMessage(error instanceof Error ? error.message : ""));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    if (isLogin) {
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
    } else {
      const errorMessages: { [key: string]: string } = {
        "auth/email-already-in-use": t("errors.emailAlreadyInUse"),
        "auth/invalid-email": t("errors.invalidEmail"),
        "auth/weak-password": t("errors.weakPassword"),
        "auth/too-many-requests": t("errors.tooManyRequests"),
      };
      return errorMessages[errorCode] || t("errors.signupFailed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
            {isLogin ? t("signIn") : t("createAccount")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <p className="text-red-800 text-sm">{error}</p>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {t("password")}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                required
                className="h-11"
              />
            </div>

            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium">
                  {t("displayName")}
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t("displayNamePlaceholder")}
                  className="h-11"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading
                ? isLogin
                  ? t("signingIn")
                  : t("signingUp")
                : isLogin
                ? t("signIn")
                : t("signUp")}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              {isLogin ? t("dontHaveAccount") : t("alreadyHaveAccount")}{" "}
              <Link
                href={isLogin ? "/auth/signup" : "/auth/login"}
                className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                {isLogin ? t("signUp") : t("signIn")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
