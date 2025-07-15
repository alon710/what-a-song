"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Music,
  Calendar,
  Trophy,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { SongData, ScoreData } from "@/lib/firebase";
import { getSongById } from "@/lib/songs";
import { saveScore, getUserScoreForSong, SaveScoreData } from "@/lib/scores";
import { GameStats, Hint } from "@/types";
import { useAuth } from "@/components/shared/AuthProvider";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import ResultsDialog from "@/components/game/ResultsDialog";
import WaitingScreen from "@/components/game/WaitingScreen";
import GameHeader from "@/components/game/GameHeader";
import HintsGrid from "@/components/game/HintsGrid";
import AlbumCover from "@/components/game/AlbumCover";
import LyricsDisplay from "@/components/game/LyricsDisplay";
import ProgressIndicator from "@/components/game/ProgressIndicator";
import GameControls from "@/components/game/GameControls";
import AttemptsHistory from "@/components/game/AttemptsHistory";
import RevealButton from "@/components/game/RevealButton";

interface GameState {
  currentGuess: string;
  revealedLines: number;
  usedHints: string[];
  gameStartTime: number;
  timeElapsed: number;
  gameWon: boolean;
  gameOver: boolean;
  triesLeft: number;
  attempts: string[];
  isAlbumBlurred: boolean;
  gameStarted: boolean;
  savedAt: number;
}

export default function PlayGame() {
  const params = useParams();
  const songId = params.id as string;
  const t = useTranslations("game.hints");
  const { user } = useAuth();

  const [songData, setSongData] = useState<SongData | null>(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [revealedLines, setRevealedLines] = useState(1);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triesLeft, setTriesLeft] = useState(3);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [isAlbumBlurred, setIsAlbumBlurred] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [userPreviousScore, setUserPreviousScore] = useState<ScoreData | null>(
    null
  );
  const [hasAlreadyPlayed, setHasAlreadyPlayed] = useState(false);
  const [userHasWon, setUserHasWon] = useState(false);

  const getStorageKey = useCallback(() => `whatASong_game_${songId}`, [songId]);

  const saveGameState = useCallback(() => {
    if (!songId || !gameStarted) return;

    const gameState: GameState = {
      currentGuess,
      revealedLines,
      usedHints,
      gameStartTime,
      timeElapsed,
      gameWon,
      gameOver,
      triesLeft,
      attempts,
      isAlbumBlurred,
      gameStarted,
      savedAt: Date.now(),
    };

    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(gameState));
    } catch (error) {
      console.warn("Failed to save game state to localStorage:", error);
    }
  }, [
    songId,
    currentGuess,
    revealedLines,
    usedHints,
    gameStartTime,
    timeElapsed,
    gameWon,
    gameOver,
    triesLeft,
    attempts,
    isAlbumBlurred,
    gameStarted,
    getStorageKey,
  ]);

  const loadGameState = useCallback(() => {
    if (!songId) return null;

    try {
      const saved = localStorage.getItem(getStorageKey());
      if (!saved) return null;

      const gameState: GameState = JSON.parse(saved);

      const maxAge = 24 * 60 * 60 * 1000;
      if (Date.now() - gameState.savedAt > maxAge) {
        localStorage.removeItem(getStorageKey());
        return null;
      }

      return gameState;
    } catch (error) {
      console.warn("Failed to load game state from localStorage:", error);

      localStorage.removeItem(getStorageKey());
      return null;
    }
  }, [songId, getStorageKey]);

  const clearGameState = useCallback(() => {
    if (!songId) return;
    localStorage.removeItem(getStorageKey());
  }, [songId, getStorageKey]);

  const restoreGameState = useCallback((gameState: GameState) => {
    setCurrentGuess(gameState.currentGuess);
    setRevealedLines(gameState.revealedLines);
    setUsedHints(gameState.usedHints);
    setGameStartTime(gameState.gameStartTime);
    setTimeElapsed(gameState.timeElapsed);
    setGameWon(gameState.gameWon);
    setGameOver(gameState.gameOver);
    setTriesLeft(gameState.triesLeft);
    setAttempts(gameState.attempts);
    setIsAlbumBlurred(gameState.isAlbumBlurred);
    setGameStarted(gameState.gameStarted);

    if (gameState.gameOver) {
      setShowStats(true);
    }
  }, []);

  const resetGameState = useCallback(() => {
    setCurrentGuess("");
    setRevealedLines(1);
    setUsedHints([]);
    setGameWon(false);
    setGameOver(false);
    setShowStats(false);
    setTimeElapsed(0);
    setTriesLeft(3);
    setAttempts([]);
    setIsAlbumBlurred(true);
    setGameStarted(false);
    clearGameState();
  }, [clearGameState]);

  const loadGame = useCallback(async () => {
    if (!songId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getSongById(songId);

      if (!result.success || !result.song) {
        throw new Error(result.error || "Song not found");
      }

      setSongData(result.song);

      if (user?.uid) {
        const scoreResult = await getUserScoreForSong(user.uid, result.song.id);
        if (scoreResult.success && scoreResult.hasPlayed && scoreResult.score) {
          setUserPreviousScore(scoreResult.score);
          setHasAlreadyPlayed(true);
          setUserHasWon(scoreResult.hasWon);
          clearGameState();
        } else {
          setUserPreviousScore(null);
          setHasAlreadyPlayed(false);
          setUserHasWon(false);

          const savedState = loadGameState();
          if (savedState && savedState.gameStarted) {
            restoreGameState(savedState);
          } else {
            resetGameState();
          }
        }
      } else {
        setUserPreviousScore(null);
        setHasAlreadyPlayed(false);
        setUserHasWon(false);

        const savedState = loadGameState();
        if (savedState && savedState.gameStarted) {
          restoreGameState(savedState);
        } else {
          resetGameState();
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load game");
    } finally {
      setLoading(false);
    }
  }, [
    songId,
    user?.uid,
    loadGameState,
    clearGameState,
    restoreGameState,
    resetGameState,
  ]);

  const startGame = () => {
    setGameStarted(true);
    setGameStartTime(Date.now());
  };

  useEffect(() => {
    saveGameState();
  }, [saveGameState]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameStartTime > 0 && !gameOver && !loading && gameStarted) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameStartTime, gameOver, loading, gameStarted]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const availableHints: Hint[] = songData
    ? [
        {
          id: "albumCover",
          label: t("albumCover"),
          icon: ImageIcon,
          value: t("albumCoverValue"),
        },
        {
          id: "artist",
          label: t("artistName"),
          icon: Users,
          value: songData.artist,
        },
        {
          id: "popularity",
          label: t("popularity"),
          icon: Trophy,
          value: `${songData.popularity}/100`,
        },
        {
          id: "album",
          label: t("album"),
          icon: Music,
          value: songData.album,
        },
        {
          id: "year",
          label: t("releaseYear"),
          icon: Calendar,
          value: songData.releaseYear.toString(),
        },
      ]
    : [];

  const checkGuess = () => {
    if (!songData || gameOver || triesLeft <= 0) return;

    const guessLower = currentGuess.toLowerCase().trim();
    if (!guessLower) return;

    const newAttempts = [...attempts, currentGuess];
    setAttempts(newAttempts);

    const isCorrect =
      songData.acceptableAnswers?.some(
        (answer) => answer.toLowerCase().trim() === guessLower
      ) || songData.songTitle.toLowerCase().trim() === guessLower;

    const newTriesLeft = triesLeft - 1;
    setTriesLeft(newTriesLeft);
    setCurrentGuess("");

    if (isCorrect) {
      setGameWon(true);
      setGameOver(true);
      setShowStats(true);
      clearGameState();

      saveGameScore(true, newAttempts, usedHints);
    } else if (newTriesLeft <= 0) {
      setGameWon(false);
      setGameOver(true);
      setShowStats(true);
      clearGameState();

      saveGameScore(false, newAttempts, usedHints);
    }
  };

  const revealNextLine = () => {
    if (songData && revealedLines < songData.translatedLyrics.length) {
      setRevealedLines((prev) => prev + 1);
    }
  };

  const revealHint = (hintId: string) => {
    if (!usedHints.includes(hintId)) {
      setUsedHints((prev) => [...prev, hintId]);

      if (hintId === "albumCover") {
        setIsAlbumBlurred(false);
      }
    }
  };

  const saveGameScore = async (
    won: boolean,
    finalAttempts: string[],
    finalUsedHints: string[]
  ) => {
    if (!songData) return;

    try {
      const scoreData: SaveScoreData = {
        songId: songData.id,
        userId: user?.uid,
        songTitle: songData.songTitle,
        artist: songData.artist,
        album: songData.album,
        releaseYear: songData.releaseYear,
        isWon: won,
        triesUsed: 3 - triesLeft,
        hintsUsed: finalUsedHints.length,
        linesRevealed: revealedLines,
        timeElapsed,
        attempts: finalAttempts,
        usedHintTypes: finalUsedHints,
      };

      const result = await saveScore(scoreData);
      if (result.success) {
        console.log("Score saved successfully:", result.score);
      } else {
        console.error("Failed to save score:", result.error);
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const getGameStats = (): GameStats => ({
    hintsUsed: usedHints.length,
    linesRevealed: revealedLines,
    timeElapsed,
    gameWon,
    triesUsed: 3 - triesLeft,
    attempts,
  });

  const resetGame = () => {
    loadGame();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!songData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-green-200 to-yellow-300 p-2 sm:p-4">
      <div className="max-w-2xl mx-auto">
        {hasAlreadyPlayed && userPreviousScore ? (
          <ResultsDialog
            open={true}
            songData={songData}
            previousScore={userPreviousScore}
            mode={userHasWon ? "alreadyWon" : "alreadyPlayed"}
          />
        ) : !gameStarted ? (
          <WaitingScreen songData={songData} onStartGame={startGame} />
        ) : (
          <div className="space-y-2 sm:space-y-4 py-2 sm:py-4 md:py-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
              {!gameOver && (
                <div className="p-2 sm:p-3 md:p-4 pb-0">
                  <HintsGrid
                    hints={availableHints}
                    usedHints={usedHints}
                    onRevealHint={revealHint}
                  />
                </div>
              )}

              <AlbumCover
                src={songData.albumCover}
                alt="Album cover"
                isBlurred={isAlbumBlurred}
              />

              <div className="px-3 sm:px-4 md:px-6 pb-1 sm:pb-2">
                <GameHeader timeElapsed={timeElapsed} triesLeft={triesLeft} />
              </div>

              <div className="p-3 sm:p-4 md:p-6">
                <LyricsDisplay
                  lyrics={songData.translatedLyrics}
                  revealedLines={revealedLines}
                />

                <ProgressIndicator
                  totalLines={songData.translatedLyrics.length}
                  revealedLines={revealedLines}
                />

                <div className="space-y-3">
                  <RevealButton
                    onRevealNext={revealNextLine}
                    canReveal={
                      revealedLines < songData.translatedLyrics.length &&
                      !gameOver
                    }
                  />

                  {!gameOver && (
                    <GameControls
                      currentGuess={currentGuess}
                      onGuessChange={setCurrentGuess}
                      onSubmitGuess={checkGuess}
                      disabled={gameOver}
                    />
                  )}
                </div>

                <AttemptsHistory attempts={attempts} />
              </div>
            </div>
          </div>
        )}

        <ResultsDialog
          open={showStats}
          songData={songData}
          stats={getGameStats()}
          mode="justFinished"
          onRestart={resetGame}
        />
      </div>
    </div>
  );
}
