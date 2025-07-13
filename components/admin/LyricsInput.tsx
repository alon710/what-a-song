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

interface LyricsInputProps {
  translatedLyrics: string[];
  originalLanguage: "en" | "he";
  onUpdate: (lyrics: string[]) => void;
}

export default function LyricsInput({
  translatedLyrics,
  originalLanguage,
  onUpdate,
}: LyricsInputProps) {
  const updateLyric = (index: number, value: string) => {
    const newLyrics = [...translatedLyrics];
    newLyrics[index] = value;
    onUpdate(newLyrics);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Translated Lyrics</CardTitle>
        <CardDescription>
          Enter up to 5 lines of translated lyrics for the game
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-lg font-medium">
            Translated Lyrics (
            {originalLanguage === "en" ? "Hebrew" : "English"})
          </Label>
          <div className="space-y-2 mt-2">
            {translatedLyrics.map((line, index) => (
              <Input
                key={index}
                placeholder={`Line ${index + 1} (optional)`}
                value={line}
                onChange={(e) => updateLyric(index, e.target.value)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
