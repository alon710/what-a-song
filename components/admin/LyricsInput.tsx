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
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Music } from "lucide-react";

interface LyricsInputProps {
  translatedLyrics: string[];
  originalLyrics?: string;
  lyricsError?: string;
  originalLanguage: "en" | "he";
  onUpdate: (lyrics: string[]) => void;
}

export default function LyricsInput({
  translatedLyrics,
  originalLyrics,
  lyricsError,
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
        {/* Original Lyrics Section */}
        {originalLyrics && (
          <div>
            <Label className="text-lg font-medium text-start flex items-center gap-2">
              <Music className="w-5 h-5" />
              {t("originalLyricsTitle")} (
              {originalLanguage === "en"
                ? tShared("english")
                : tShared("hebrew")}
              )
            </Label>
            <Textarea
              value={originalLyrics}
              className="mt-2 min-h-[120px] bg-gray-50 text-start"
              readOnly
              placeholder={t("originalLyricsPlaceholder")}
            />
          </div>
        )}

        {/* Error message if lyrics couldn't be fetched */}
        {lyricsError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">
                {lyricsError}. {t("errorCanContinue")}
              </span>
            </div>
          </div>
        )}

        {/* Translated Lyrics Section */}
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
