"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { SongData } from "@/lib/firebase";
import { getActiveSongs } from "@/lib/songs";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import SongCard from "@/components/shared/SongCard";
import CenteredLayout from "@/components/shared/CenteredLayout";
import { useUserScores } from "@/hooks/useUserScores";

export default function History() {
  const t = useTranslations("history");
  const [songs, setSongs] = useState<SongData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getUserScoreForSong } = useUserScores();

  const loadGames = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const songsResult = await getActiveSongs();
      if (!songsResult.success) {
        throw new Error(songsResult.error || "Failed to load games");
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const pastSongs = (songsResult.songs || []).filter((song) => {
        if (!song.gameDate) return false;
        const gameDate = new Date(song.gameDate);
        gameDate.setHours(0, 0, 0, 0);
        return gameDate.getTime() <= today.getTime();
      });

      const sortedSongs = pastSongs.sort((a, b) => {
        if (!a.gameDate || !b.gameDate) return 0;
        return new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime();
      });

      setSongs(sortedSongs);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load games");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <CenteredLayout maxWidth="7xl">
      {songs.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-2">{t("noGamesYet")}</h2>
            <p className="text-gray-600 mb-4">{t("noGamesMessage")}</p>
            <p className="text-sm text-gray-500">{t("checkBackSoon")}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {songs.map((song) => {
            const userScore = getUserScoreForSong(song.id);
            return (
              <SongCard
                key={song.id}
                song={song}
                userHasPlayed={userScore.hasPlayed}
                userHasWon={userScore.hasWon}
                showDate={true}
              />
            );
          })}
        </div>
      )}
    </CenteredLayout>
  );
}
