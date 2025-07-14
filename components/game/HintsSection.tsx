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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          {t("title")}
          <Badge variant="outline">
            {t("used", { used: usedHints.length, total: hints.length })}
          </Badge>
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
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
                className={`p-3 border rounded-lg ${
                  isUsed ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{getHintLabel(hint.id)}</span>
                  </div>
                  {!isUsed ? (
                    <Button
                      onClick={() => onUseHint(hint.id)}
                      size="sm"
                      variant="outline"
                      disabled={disabled}
                    >
                      {t("reveal")}
                    </Button>
                  ) : (
                    <span
                      className={`text-lg font-semibold ${
                        hint.id === "albumCover"
                          ? "text-green-700"
                          : "text-blue-700"
                      }`}
                    >
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
