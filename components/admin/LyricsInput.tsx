"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface LyricsInputProps {
  translatedLyrics: string[];
  originalLanguage: "en" | "he";
  onUpdate: (lyrics: string[]) => void;
}

export default function LyricsInput({
  translatedLyrics,
  originalLanguage,
  onUpdate,
}: LyricsInputProps) {
  const t = useTranslations("admin.lyricsInput");
  const tShared = useTranslations("shared.languages");

  const updateLyric = (index: number, value: string) => {
    const newLyrics = [...translatedLyrics];
    newLyrics[index] = value;
    onUpdate(newLyrics);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-start">{t("title")}</CardTitle>
        <CardDescription className="text-start">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-lg font-medium text-start">
            {t("translatedLyrics", {
              language:
                originalLanguage === "en"
                  ? tShared("hebrew")
                  : tShared("english"),
            })}
          </Label>
          <div className="space-y-2 mt-2">
            {translatedLyrics.map((line, index) => {
              const isEmpty = !line.trim();
              return (
                <Input
                  key={index}
                  placeholder={t("placeholder", { number: index + 1 })}
                  value={line}
                  onChange={(e) => updateLyric(index, e.target.value)}
                  className={`text-start ${
                    isEmpty ? "border-red-300 focus:border-red-500" : ""
                  }`}
                  required
                />
              );
            })}
          </div>
          {translatedLyrics.some((line) => !line.trim()) && (
            <p className="text-sm text-red-600 mt-2">{t("allLinesRequired")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
