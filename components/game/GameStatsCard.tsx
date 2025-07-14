"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface GameStatsCardProps {
  hintsUsed: number;
  linesRevealed: number;
  timeElapsed: number;
  triesLeft: number;
}

export default function GameStatsCard({
  hintsUsed,
  linesRevealed,
  timeElapsed,
  triesLeft,
}: GameStatsCardProps) {
  const t = useTranslations("game.stats");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-start">
          <Clock className="w-5 h-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-start">{t("triesLeft")}:</span>
          <Badge
            variant={
              triesLeft <= 1
                ? "destructive"
                : triesLeft <= 2
                ? "outline"
                : "default"
            }
          >
            {triesLeft}/5
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-start">{t("hintsUsed")}:</span>
          <Badge>{hintsUsed}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-start">{t("linesRevealed")}:</span>
          <Badge>{linesRevealed}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-start">{t("time")}:</span>
          <Badge>{formatTime(timeElapsed)}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
