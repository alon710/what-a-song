"use client";

import { Music } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoadingState() {
  const t = useTranslations("game");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Music className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <p className="text-lg text-gray-800">{t("loading")}</p>
      </div>
    </div>
  );
}
