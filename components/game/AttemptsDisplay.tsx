"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { useTranslations } from "next-intl";

interface AttemptsDisplayProps {
  attempts: string[];
  triesLeft: number;
}

export default function AttemptsDisplay({
  attempts,
  triesLeft,
}: AttemptsDisplayProps) {
  const t = useTranslations("game.attempts");

  if (attempts.length === 0) {
    return null;
  }

  const usedTries = 5 - triesLeft;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>
          {t("description", { used: usedTries })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {attempts.map((attempt, index) => (
            <Badge key={index} variant="outline" className="text-sm">
              {attempt}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
