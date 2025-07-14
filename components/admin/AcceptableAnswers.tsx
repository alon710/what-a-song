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
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { SpotifyTrack } from "@/types";

interface AcceptableAnswersProps {
  acceptableAnswers: string[];
  onUpdate: (answers: string[]) => void;
  selectedSong: SpotifyTrack | null;
}

export default function AcceptableAnswers({
  acceptableAnswers,
  onUpdate,
  selectedSong,
}: AcceptableAnswersProps) {
  const t = useTranslations("admin.acceptableAnswers");

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...acceptableAnswers];
    newAnswers[index] = value;
    onUpdate(newAnswers);
  };

  const addAnswer = () => {
    onUpdate([...acceptableAnswers, ""]);
  };

  const removeAnswer = (index: number) => {
    if (acceptableAnswers.length > 1) {
      const newAnswers = acceptableAnswers.filter((_, i) => i !== index);
      onUpdate(newAnswers);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-start">{t("title")}</CardTitle>
        <CardDescription className="text-start">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {acceptableAnswers.map((answer, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={t("placeholder", {
                number: index + 1,
                songName: selectedSong?.name || "",
              })}
              value={answer}
              onChange={(e) => updateAnswer(index, e.target.value)}
              className="flex-1 text-start"
            />
            {acceptableAnswers.length > 1 && (
              <Button
                onClick={() => removeAnswer(index)}
                variant="outline"
                size="sm"
                className="px-3"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </Button>
            )}
          </div>
        ))}
        <Button
          onClick={addAnswer}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 me-2" />
          {t("addButton")}
        </Button>
        <p className="text-xs text-muted-foreground text-start">{t("tip")}</p>
      </CardContent>
    </Card>
  );
}
