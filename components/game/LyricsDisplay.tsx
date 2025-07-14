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
import { Eye, Music } from "lucide-react";
import { useTranslations } from "next-intl";

interface LyricsDisplayProps {
  lyrics: string[];
  revealedLines: number;
  onRevealNext: () => void;
  canRevealMore: boolean;
  originalLanguage: "en" | "he";
}

export default function LyricsDisplay({
  lyrics,
  revealedLines,
  onRevealNext,
  canRevealMore,
  originalLanguage,
}: LyricsDisplayProps) {
  const t = useTranslations("game.lyricsDisplay");
  const tShared = useTranslations("shared.languages");

  const targetLanguage =
    originalLanguage === "en" ? tShared("hebrew") : tShared("english");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>
          {t("description", { language: targetLanguage })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {lyrics.slice(0, revealedLines).map((line, index) => (
          <div key={index} className="p-4 bg-slate-100 rounded-lg">
            <p className="text-lg font-medium">{line}</p>
          </div>
        ))}

        <div className="flex justify-between items-center">
          <Badge variant="outline">
            {t("linesRevealed", {
              revealed: revealedLines,
              total: lyrics.length,
            })}
          </Badge>

          {canRevealMore && (
            <Button variant="outline" onClick={onRevealNext}>
              <Eye className="w-4 h-4 mr-2" />
              {t("revealNext")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
