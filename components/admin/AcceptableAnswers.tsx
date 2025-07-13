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
        <CardTitle>Acceptable Answers</CardTitle>
        <CardDescription>
          Add multiple valid ways to write the song title (e.g., with/without
          parentheses, shortened versions)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {acceptableAnswers.map((answer, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={`Answer ${index + 1} (e.g., "${
                selectedSong?.name
              }")`}
              value={answer}
              onChange={(e) => updateAnswer(index, e.target.value)}
              className="flex-1"
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
          <Plus className="w-4 h-4 mr-2" />
          Add Another Answer
        </Button>
        <p className="text-xs text-muted-foreground">
          💡 Tip: Consider adding shortened versions, versions without
          parentheses, common nicknames, or alternate spellings that players
          might guess.
        </p>
      </CardContent>
    </Card>
  );
}
