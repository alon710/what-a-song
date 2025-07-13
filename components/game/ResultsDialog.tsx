"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Lightbulb,
  Trophy,
  Target,
} from "lucide-react";
import { GameStats } from "@/types";
import { GameData } from "@/lib/firebase";

interface ResultsDialogProps {
  open: boolean;
  gameData: GameData | null;
  stats: GameStats;
  onRestart: () => void;
}

export default function ResultsDialog({
  open,
  gameData,
  stats,
  onRestart,
}: ResultsDialogProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!gameData) return null;

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {stats.gameWon ? (
              <CheckCircle className="w-16 h-16 text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <DialogTitle className="text-center text-2xl">
            {stats.gameWon ? "Congratulations! 🎉" : "Game Over 😔"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {stats.gameWon ? (
              <>
                You correctly guessed: <strong>{gameData.songTitle}</strong>
              </>
            ) : (
              <>
                The song was: <strong>{gameData.songTitle}</strong>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Time</span>
              </div>
              <Badge variant="outline" className="text-lg">
                {formatTime(stats.timeElapsed)}
              </Badge>
            </div>

            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Tries</span>
              </div>
              <Badge variant="outline" className="text-lg">
                {stats.triesUsed}/5
              </Badge>
            </div>

            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Lines</span>
              </div>
              <Badge variant="outline" className="text-lg">
                {stats.linesRevealed}/{gameData.translatedLyrics.length}
              </Badge>
            </div>

            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">Hints</span>
              </div>
              <Badge variant="outline" className="text-lg">
                {stats.hintsUsed}/5
              </Badge>
            </div>
          </div>

          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Result</span>
            </div>
            <Badge
              variant={stats.gameWon ? "default" : "secondary"}
              className="text-lg"
            >
              {stats.gameWon ? "WIN" : "LOSS"}
            </Badge>
          </div>

          {stats.attempts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Your Attempts:
              </h4>
              <div className="flex flex-wrap gap-2">
                {stats.attempts.map((attempt, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {attempt}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>by {gameData.artist}</p>
            <p>
              from "{gameData.album}" ({gameData.releaseYear})
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={onRestart} className="flex-1">
              Play Again
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href="/" className="text-center">
                Home
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
