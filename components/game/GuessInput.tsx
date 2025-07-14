"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface GuessInputProps {
  guess: string;
  onGuessChange: (guess: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  triesLeft: number;
}

export default function GuessInput({
  guess,
  onGuessChange,
  onSubmit,
  disabled,
  triesLeft,
}: GuessInputProps) {
  const t = useTranslations("game.guessInput");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      onSubmit();
    }
  };

  const triesText = triesLeft === 1 ? t("tryText.one") : t("tryText.other");

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">{t("title")}</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {t("description")}
          {triesLeft > 0 && (
            <span
              className={`block mt-1 text-sm font-medium ${
                triesLeft <= 2 ? "text-red-600" : "text-muted-foreground"
              }`}
            >
              {t("triesRemaining", { tries: triesLeft, triesText })}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <Input
          placeholder={t("placeholder")}
          value={guess}
          onChange={(e) => onGuessChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="h-11 sm:h-12 text-base"
        />
        <Button
          onClick={onSubmit}
          disabled={disabled || !guess.trim()}
          className="w-full h-11 sm:h-12 text-base font-medium touch-manipulation"
          size="lg"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {t("submitGuess")}
        </Button>
      </CardContent>
    </Card>
  );
}
