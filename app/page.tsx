"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { SongData } from "@/lib/firebase";
import { getTodaysSong } from "@/lib/songs";
import Link from "next/link";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import SongCard from "@/components/shared/SongCard";
import CenteredLayout from "@/components/shared/CenteredLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserScores } from "@/hooks/useUserScores";

export default function Home() {
  const t = useTranslations("home");
  const [todaysSong, setTodaysSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getUserScoreForSong } = useUserScores();

  const loadTodaysGame = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const songResult = await getTodaysSong();
      if (!songResult.success) {
        throw new Error(songResult.error || "No game available for today");
      }

      setTodaysSong(songResult.song || null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load today's game"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodaysGame();
  }, [loadTodaysGame]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const userScore = todaysSong ? getUserScoreForSong(todaysSong.id) : null;

  return (
    <CenteredLayout>
      <div className="pt-4">
        {!todaysSong ? (
          <div className="text-center py-2">
            <div className="bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{t("noGameToday")}</h2>
              <p className="text-gray-600 mb-4">{t("noGameTodayMessage")}</p>
              <p className="text-sm text-gray-500">{t("checkBackTomorrow")}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            {/* Game Instructions Card */}
            <Card className="w-full border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-900 text-center">
                  {t("howToPlay.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 text-sm">
                      {t("howToPlay.step1.title")}
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">
                      {t("howToPlay.step1.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 text-sm">
                      {t("howToPlay.step2.title")}
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">
                      {t("howToPlay.step2.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 text-sm">
                      {t("howToPlay.step3.title")}
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">
                      {t("howToPlay.step3.description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Song Card */}
            <div className="w-full ">
              <SongCard
                song={todaysSong}
                userHasPlayed={userScore?.hasPlayed || false}
                userHasWon={userScore?.hasWon || false}
                showDate={false}
              />
            </div>

            <Link href={`/play/${todaysSong.id}`} className="w-full ">
              <Button
                size="lg"
                className="w-full text-lg py-6 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("startNow")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </CenteredLayout>
  );
}
