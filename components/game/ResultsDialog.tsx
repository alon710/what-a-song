"use client";

import {
  XCircle,
  Clock,
  Lightbulb,
  Trophy,
  Target,
  Calendar,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { SongData, ScoreData } from "@/lib/firebase";
import AlbumCover from "./AlbumCover";

interface ResultsDialogProps {
  open: boolean;
  songData: SongData | null;
  previousScore?: ScoreData;
  mode: "justWon" | "justPlayed";
}

export default function ResultsDialog({
  open,
  songData,
  previousScore,
  mode,
}: ResultsDialogProps) {
  const tJustWon = useTranslations("game.justWon");
  const tJustPlayed = useTranslations("game.justPlayed");
  const tCommon = useTranslations("common");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!songData || !previousScore || !open) return null;

  const isWon = mode === "justWon";
  const t = isWon ? tJustWon : tJustPlayed;

  return (
    <div className="py-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
        <AlbumCover
          src={songData.albumCover}
          alt={tCommon("albumCover")}
          isBlurred={false}
        />

        <div className="p-6">
          {/* Song Info */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {songData.songTitle}
            </h2>
            <p className="text-gray-600">
              {tCommon("by", { artist: songData.artist })}
            </p>
          </div>

          {/* Result Status */}
          <div
            className={`${
              isWon
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            } rounded-xl p-4 mb-6 border`}
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

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {t("stats.time")}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-800">
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
                <div className="text-lg font-bold text-gray-800">
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
                <div className="text-lg font-bold text-gray-800">
                  {previousScore.hintsUsed}/5
                </div>
              </div>

              {isWon && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {t("stats.score")}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {previousScore.score.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {/* Show attempts for failed games */}
            {!isWon &&
              previousScore.attempts &&
              previousScore.attempts.length > 0 && (
                <div className="pt-4 border-t border-red-200">
                  <div className="text-xs text-gray-600 mb-2 text-center">
                    {tJustPlayed("yourAttempts")}:
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

            {/* Date */}
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

          {/* Final Score Message */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">{t("finalScore")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
