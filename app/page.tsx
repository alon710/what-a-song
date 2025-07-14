"use client";

import { useState, useEffect, useCallback } from "react";
import { SongData, ScoreData } from "@/lib/firebase";
import { getActiveSongs } from "@/lib/songs";
import { getUserScores } from "@/lib/scores";
import { useAuth } from "@/components/shared/AuthProvider";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import SongCard from "@/components/shared/SongCard";

interface UserScoreMap {
  [songId: string]: {
    hasPlayed: boolean;
    hasWon: boolean;
    score: ScoreData;
  };
}

export default function Home() {
  const { user } = useAuth();
  const [songs, setSongs] = useState<SongData[]>([]);
  const [userScores, setUserScores] = useState<UserScoreMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGames = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all active songs
      const songsResult = await getActiveSongs();
      if (!songsResult.success) {
        throw new Error(songsResult.error || "Failed to load games");
      }

      setSongs(songsResult.songs || []);

      // Fetch user scores if logged in
      if (user?.uid) {
        const scoresResult = await getUserScores(user.uid);
        if (scoresResult.success && scoresResult.scores) {
          const scoreMap: UserScoreMap = {};
          scoresResult.scores.forEach((score) => {
            scoreMap[score.songId] = {
              hasPlayed: true,
              hasWon: score.isWon,
              score,
            };
          });
          setUserScores(scoreMap);
        }
      } else {
        setUserScores({});
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load games");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

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
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {songs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">No games available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {songs.map((song) => {
              const userScore = userScores[song.id];
              return (
                <SongCard
                  key={song.id}
                  song={song}
                  userHasPlayed={userScore?.hasPlayed || false}
                  userHasWon={userScore?.hasWon || false}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
