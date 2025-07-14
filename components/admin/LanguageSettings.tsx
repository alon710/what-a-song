"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface LanguageSettingsProps {
  originalLanguage: "en" | "he";
  onLanguageChange: (language: "en" | "he") => void;
}

export default function LanguageSettings({
  originalLanguage,
  onLanguageChange,
}: LanguageSettingsProps) {
  const t = useTranslations("admin.languageSettings");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-start">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Label className="text-start">{t("originalLanguage")}</Label>
        <div className="flex gap-2 mt-2">
          <Button
            variant={originalLanguage === "en" ? "default" : "outline"}
            onClick={() => onLanguageChange("en")}
          >
            {t("english")}
          </Button>
          <Button
            variant={originalLanguage === "he" ? "default" : "outline"}
            onClick={() => onLanguageChange("he")}
          >
            {t("hebrew")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
