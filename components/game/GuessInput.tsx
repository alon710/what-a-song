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
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description")}
          {triesLeft > 0 && (
            <span
              className={`block mt-1 ${
                triesLeft <= 2
                  ? "text-red-600 font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {t("triesRemaining", { tries: triesLeft, triesText })}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder={t("placeholder")}
          value={guess}
          onChange={(e) => onGuessChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        <Button
          onClick={onSubmit}
          disabled={disabled || !guess.trim()}
          className="w-full"
        >
          {t("submitGuess")}
        </Button>
      </CardContent>
    </Card>
  );
}
