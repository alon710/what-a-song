"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { SongData } from "@/lib/firebase";
import { getTodaysSong } from "@/lib/songs";
import { format } from "date-fns";
import Link from "next/link";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import SongCard from "@/components/shared/SongCard";
import PageHeader from "@/components/shared/PageHeader";
import CenteredLayout from "@/components/shared/CenteredLayout";
import { Button } from "@/components/ui/button";
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

  const today = new Date();
  const userScore = todaysSong ? getUserScoreForSong(todaysSong.id) : null;

  return (
    <CenteredLayout>
      <PageHeader
        title={t("todaysChallenge")}
        subtitle={format(today, "EEEE, MMMM do, yyyy")}
        description={t("canYouGuess")}
      />

      {!todaysSong ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-2">{t("noGameToday")}</h2>
            <p className="text-gray-600 mb-4">{t("noGameTodayMessage")}</p>
            <p className="text-sm text-gray-500">{t("checkBackTomorrow")}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full max-w-xs">
            <SongCard
              song={todaysSong}
              userHasPlayed={userScore?.hasPlayed || false}
              userHasWon={userScore?.hasWon || false}
              showDate={false}
            />
          </div>
          <Link href={`/play/${todaysSong.id}`}>
            <Button size="lg" className="text-lg px-8 py-6">
              {t("startNow")}
            </Button>
          </Link>
        </div>
      )}

      <div className="text-center mt-12">
        <p className="text-sm text-gray-500 mb-2">{t("wantToPrevious")}</p>
        <Link
          href="/history"
          className="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          {t("viewHistory")}
        </Link>
      </div>
    </CenteredLayout>
  );
}
