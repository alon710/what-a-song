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
  Calendar,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { GameStats } from "@/types";
import { SongData, ScoreData } from "@/lib/firebase";
import Link from "next/link";
import AlbumCover from "./AlbumCover";

interface ResultsDialogProps {
  open: boolean;
  songData: SongData | null;
  stats?: GameStats;
  previousScore?: ScoreData;
  mode: "justFinished" | "alreadyWon" | "alreadyPlayed";
  onRestart?: () => void;
}

export default function ResultsDialog({
  open,
  songData,
  stats,
  previousScore,
  mode,
  onRestart,
}: ResultsDialogProps) {
  const tResults = useTranslations("game.results");
  const tAlreadyWon = useTranslations("game.alreadyWon");
  const tAlreadyPlayed = useTranslations("game.alreadyPlayed");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!songData) return null;

  // For modal-style display (just finished playing)
  if (mode === "justFinished" && stats) {
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
              {stats.gameWon ? tResults("win") : tResults("lose")}
            </DialogTitle>
            <DialogDescription className="text-center">
              {stats.gameWon
                ? tResults("winMessage", { songTitle: songData.songTitle })
                : tResults("loseMessage", { songTitle: songData.songTitle })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {tResults("stats.time")}
                  </span>
                </div>
                <Badge variant="outline" className="text-lg">
                  {formatTime(stats.timeElapsed)}
                </Badge>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {tResults("stats.tries")}
                  </span>
                </div>
                <Badge variant="outline" className="text-lg">
                  {stats.triesUsed}/3
                </Badge>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {tResults("stats.lines")}
                  </span>
                </div>
                <Badge variant="outline" className="text-lg">
                  {stats.linesRevealed}/{songData.translatedLyrics.length}
                </Badge>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {tResults("stats.hints")}
                  </span>
                </div>
                <Badge variant="outline" className="text-lg">
                  {stats.hintsUsed}/5
                </Badge>
              </div>
            </div>

            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {tResults("stats.result")}
                </span>
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
                  {tResults("attempts")}
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
              <p>{tResults("songInfo", { artist: songData.artist })}</p>
              <p>
                {tResults("albumInfo", {
                  album: songData.album,
                  year: songData.releaseYear,
                })}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={onRestart} className="flex-1">
                {tResults("playAgain")}
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/" className="text-center">
                  {tResults("home")}
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // For full-screen display (already played/won)
  if ((mode === "alreadyWon" || mode === "alreadyPlayed") && previousScore) {
    const isWon = mode === "alreadyWon";
    const t = isWon ? tAlreadyWon : tAlreadyPlayed;

    return (
      <div className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            {isWon ? (
              <Trophy className="w-8 h-8 text-yellow-500" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500" />
            )}
            <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
          </div>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
          <AlbumCover
            src={songData.albumCover}
            alt="Album cover"
            isBlurred={false}
          />

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {songData.songTitle}
              </h2>
              <p className="text-gray-600">by {songData.artist}</p>
            </div>

            {/* Previous Score Stats */}
            <div
              className={`${
                isWon ? "bg-green-50" : "bg-red-50"
              } rounded-xl p-6 mb-6`}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                {isWon ? (
                  <Trophy className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <h3
                  className={`text-lg font-semibold ${
                    isWon ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isWon ? t("previousWin") : t("previousAttempt")}
                </h3>
              </div>

              <div
                className={`grid ${
                  isWon ? "grid-cols-2" : "grid-cols-3"
                } gap-4`}
              >
                {isWon && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">
                        {t("stats.score")}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {previousScore.score.toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {t("stats.time")}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {formatTime(previousScore.timeElapsed)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">
                      {t("stats.tries")}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {previousScore.triesUsed}/3
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {t("stats.hints")}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {previousScore.hintsUsed}/5
                  </div>
                </div>
              </div>

              {/* Show user's attempts for failed games */}
              {!isWon &&
                previousScore.attempts &&
                previousScore.attempts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <div className="text-xs text-gray-600 mb-2">
                      {tAlreadyPlayed("yourAttempts")}:
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {previousScore.attempts.map((attempt, index) => (
                        <span
                          key={index}
                          className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md"
                        >
                          {attempt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div
                className={`mt-4 pt-4 border-t ${
                  isWon ? "border-green-200" : "border-red-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {isWon
                      ? t("wonOn", {
                          date: formatDate(previousScore.completedAt),
                        })
                      : t("playedOn", {
                          date: formatDate(previousScore.completedAt),
                        })}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 text-center">
                {t("finalScore")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
