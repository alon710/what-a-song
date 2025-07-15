import { useState, useEffect, useCallback } from "react";
import { getUserScores } from "@/lib/scores";
import { useAuth } from "@/components/shared/AuthProvider";
import { ScoreData } from "@/lib/firebase";

interface UserScoreMap {
  [songId: string]: {
    hasPlayed: boolean;
    hasWon: boolean;
    score: ScoreData;
  };
}

export function useUserScores() {
  const { user } = useAuth();
  const [userScores, setUserScores] = useState<UserScoreMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserScores = useCallback(async () => {
    if (!user?.uid) {
      setUserScores({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
      } else {
        setUserScores({});
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load user scores"
      );
      setUserScores({});
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchUserScores();
  }, [fetchUserScores]);

  const getUserScoreForSong = useCallback(
    (songId: string) => {
      return (
        userScores[songId] || { hasPlayed: false, hasWon: false, score: null }
      );
    },
    [userScores]
  );

  return {
    userScores,
    loading,
    error,
    refetch: fetchUserScores,
    getUserScoreForSong,
  };
}
