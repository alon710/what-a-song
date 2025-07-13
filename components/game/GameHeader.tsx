"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Music } from "lucide-react";
import Link from "next/link";

interface GameHeaderProps {
  revealedLines: number;
  totalLines: number;
  timeElapsed: number;
  onRestart: () => void;
}

export default function GameHeader({
  revealedLines,
  totalLines,
  timeElapsed,
  onRestart,
}: GameHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (revealedLines / totalLines) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Link href="/">
          <Button variant="outline" size="sm">
            ← Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">🎵 What a Song</h1>
        <Button onClick={onRestart} variant="outline" size="sm">
          New Game
        </Button>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              <span>
                Lines: {revealedLines}/{totalLines}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Time: {formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
