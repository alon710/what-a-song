"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function PlayRedirect() {
  const router = useRouter();
  const t = useTranslations("shared");

  useEffect(() => {
    // Redirect to home page immediately
    router.replace("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="text-gray-800">
          <p className="text-lg">{t("loading")}...</p>
          <p className="text-sm text-gray-600">Redirecting to game...</p>
        </div>
      </div>
    </div>
  );
}
