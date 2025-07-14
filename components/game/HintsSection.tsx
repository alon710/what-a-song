"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";
import { Hint } from "@/types";

interface HintsSectionProps {
  hints: Hint[];
  usedHints: string[];
  onUseHint: (hintId: string) => void;
  disabled: boolean;
}

export default function HintsSection({
  hints,
  usedHints,
  onUseHint,
  disabled,
}: HintsSectionProps) {
  const t = useTranslations("game.hints");

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t("title")}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {t("used", { used: usedHints.length, total: hints.length })}
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-start">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:gap-3">
          {hints.map((hint) => {
            const isUsed = usedHints.includes(hint.id);
            const Icon = hint.icon;

            // Get translated hint label
            const getHintLabel = (hintId: string) => {
              switch (hintId) {
                case "albumCover":
                  return t("albumCover");
                case "artist":
                  return t("artistName");
                case "popularity":
                  return t("popularity");
                case "album":
                  return t("album");
                case "year":
                  return t("releaseYear");
                default:
                  return hint.label;
              }
            };

            return (
              <div
                key={hint.id}
                className={`p-3 sm:p-4 border rounded-lg ${
                  isUsed ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-sm sm:text-base text-start break-words">
                      {getHintLabel(hint.id)}
                    </span>
                  </div>
                  {!isUsed ? (
                    <Button
                      onClick={() => onUseHint(hint.id)}
                      size="sm"
                      variant="outline"
                      disabled={disabled}
                      className="h-8 px-3 text-xs sm:text-sm touch-manipulation flex-shrink-0"
                    >
                      {t("reveal")}
                    </Button>
                  ) : (
                    <span className="text-xs sm:text-sm font-medium flex-shrink-0 text-start text-primary break-words max-w-[50%]">
                      {hint.id === "albumCover"
                        ? t("albumRevealed")
                        : hint.value}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
