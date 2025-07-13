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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Translated Lyrics
        </CardTitle>
        <CardDescription>
          Guess the song title from these translated lyrics (
          {originalLanguage === "en" ? "Hebrew" : "English"})
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
            {revealedLines} of {lyrics.length} lines revealed
          </Badge>

          {canRevealMore && (
            <Button variant="outline" onClick={onRevealNext}>
              <Eye className="w-4 h-4 mr-2" />
              Reveal Next Line
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
