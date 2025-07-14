"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Music,
  Calendar,
  Trophy,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { GameData } from "@/lib/firebase";
import { getRandomGame, saveScore, SaveScoreData } from "@/lib/actions";
import { GameStats, Hint } from "@/types";
import { useAuth } from "@/components/shared/AuthProvider";

import LoadingState from "@/components/game/LoadingState";
import ErrorState from "@/components/game/ErrorState";
import ResultsDialog from "@/components/game/ResultsDialog";

export default function Home() {
  const t = useTranslations("game.hints");
  const tGame = useTranslations("game");
  const locale = useLocale();
  const { user, userData } = useAuth();
  const [gameData, setGameData] = useState<GameData | null>(null);
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

  const loadGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRandomGame();

      if (!result.success || !result.game) {
        throw new Error(result.error || "No game data received");
      }

      setGameData(result.game);
      resetGameState();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load game");
    } finally {
      setLoading(false);
    }
  }, []);

  const resetGameState = () => {
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
  };

  const startGame = () => {
    setGameStarted(true);
    setGameStartTime(Date.now());
  };

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

  const availableHints: Hint[] = gameData
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
          value: gameData.artist,
        },
        {
          id: "popularity",
          label: t("popularity"),
          icon: Trophy,
          value: `${gameData.popularity}/100`,
        },
        {
          id: "album",
          label: t("album"),
          icon: Music,
          value: gameData.album,
        },
        {
          id: "year",
          label: t("releaseYear"),
          icon: Calendar,
          value: gameData.releaseYear.toString(),
        },
      ]
    : [];

  const checkGuess = () => {
    if (!gameData || gameOver || triesLeft <= 0) return;

    const guessLower = currentGuess.toLowerCase().trim();
    if (!guessLower) return;

    const newAttempts = [...attempts, currentGuess];
    setAttempts(newAttempts);

    const isCorrect =
      gameData.acceptableAnswers?.some(
        (answer) => answer.toLowerCase().trim() === guessLower
      ) || gameData.songTitle.toLowerCase().trim() === guessLower;

    const newTriesLeft = triesLeft - 1;
    setTriesLeft(newTriesLeft);
    setCurrentGuess("");

    if (isCorrect) {
      setGameWon(true);
      setGameOver(true);
      setShowStats(true);

      saveGameScore(true, newAttempts, usedHints);
    } else if (newTriesLeft <= 0) {
      setGameWon(false);
      setGameOver(true);
      setShowStats(true);

      saveGameScore(false, newAttempts, usedHints);
    }
  };

  const revealNextLine = () => {
    if (gameData && revealedLines < gameData.translatedLyrics.length) {
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
    if (!gameData) return;

    try {
      const scoreData: SaveScoreData = {
        gameId: gameData.id,
        userId: user?.uid,
        userEmail: user?.email || undefined,
        userName: userData?.displayName || user?.displayName || undefined,
        songTitle: gameData.songTitle,
        artist: gameData.artist,
        album: gameData.album,
        releaseYear: gameData.releaseYear,
        gameWon: won,
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

  if (!gameData) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-green-200 to-yellow-300 p-4">
      <div className="max-w-2xl mx-auto">
        {!gameStarted ? (
          <div className="text-center space-y-8 py-16">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {tGame("title")}
              </h1>
              <p className="text-gray-600">{tGame("waitingToStart")}</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
              <div className="relative aspect-square m-4 rounded-xl overflow-hidden">
                <Image
                  src={gameData.albumCover}
                  alt="Album cover"
                  fill
                  className="object-cover filter blur-sm"
                />
                <div
                  className={`absolute top-4 ${
                    locale === "he" ? "right-4" : "left-4"
                  } bg-white/80 backdrop-blur-sm rounded-lg p-3`}
                >
                  <div className="text-sm text-gray-600 font-medium">
                    <span
                      className={`transition-all duration-500 ${
                        !usedHints.includes("artist")
                          ? "filter blur-sm select-none"
                          : ""
                      }`}
                    >
                      {!usedHints.includes("artist")
                        ? "████████"
                        : gameData.artist}
                    </span>
                    {", "}
                    <span
                      className={`transition-all duration-500 ${
                        !usedHints.includes("year")
                          ? "filter blur-sm select-none"
                          : ""
                      }`}
                    >
                      {!usedHints.includes("year")
                        ? "████"
                        : gameData.releaseYear}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-2 mb-6">
                  {gameData.translatedLyrics.slice(0, 3).map((_, index) => (
                    <div
                      key={index}
                      className="text-center py-2 text-gray-400 filter blur-sm select-none"
                    >
                      ████████ ████ ████████
                    </div>
                  ))}
                </div>

                <button
                  onClick={startGame}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  {tGame("startGame")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-8">
            {/* Header with artist info and album cover */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
              <div className="relative aspect-square m-4 rounded-xl overflow-hidden">
                <Image
                  src={gameData.albumCover}
                  alt="Album cover"
                  fill
                  className={`object-cover transition-all duration-700 ${
                    isAlbumBlurred ? "filter blur-lg" : "filter blur-none"
                  }`}
                />
                <div
                  className={`absolute top-4 ${
                    locale === "he" ? "right-4" : "left-4"
                  } bg-white/80 backdrop-blur-sm rounded-lg p-3`}
                >
                  <div className="text-sm text-gray-600 font-medium">
                    <span
                      className={`transition-all duration-500 ${
                        !usedHints.includes("artist")
                          ? "filter blur-sm select-none"
                          : ""
                      }`}
                    >
                      {!usedHints.includes("artist")
                        ? "████████"
                        : gameData.artist}
                    </span>
                    {", "}
                    <span
                      className={`transition-all duration-500 ${
                        !usedHints.includes("year")
                          ? "filter blur-sm select-none"
                          : ""
                      }`}
                    >
                      {!usedHints.includes("year")
                        ? "████"
                        : gameData.releaseYear}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(timeElapsed)} • {triesLeft} of 3 tries left
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Lyrics display */}
                <div className="space-y-3 mb-6">
                  {gameData.translatedLyrics.map((lyric, index) => (
                    <div
                      key={index}
                      className={`text-center py-2 transition-all duration-500 ${
                        index < revealedLines
                          ? "text-gray-800 font-medium"
                          : "text-gray-400 filter blur-sm select-none"
                      }`}
                    >
                      {index < revealedLines ? lyric : "████████ ████ ████████"}
                    </div>
                  ))}
                </div>

                {/* Progress circles */}
                <div className="flex justify-center space-x-2 mb-6">
                  {gameData.translatedLyrics.map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors ${
                        index < revealedLines
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-200 text-gray-500 border-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  {revealedLines < gameData.translatedLyrics.length &&
                    !gameOver && (
                      <button
                        onClick={revealNextLine}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                      >
                        {tGame("lyricsDisplay.revealNext")}
                      </button>
                    )}

                  {!gameOver && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={currentGuess}
                        onChange={(e) => setCurrentGuess(e.target.value)}
                        placeholder={tGame("guessInput.placeholder")}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === "Enter" && checkGuess()}
                      />
                      <button
                        onClick={checkGuess}
                        disabled={!currentGuess.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                      >
                        {tGame("guessInput.submitGuess")}
                      </button>
                    </div>
                  )}
                </div>

                {/* Attempts history */}
                {attempts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-2">
                      Previous attempts:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {attempts.map((attempt, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md"
                        >
                          {attempt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hints section */}
            {availableHints.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Hints ({usedHints.length}/{availableHints.length})
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {availableHints.map((hint) => {
                    const isUsed = usedHints.includes(hint.id);
                    const Icon = hint.icon;

                    return (
                      <div
                        key={hint.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isUsed
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">
                            {hint.id === "albumCover"
                              ? t("albumCover")
                              : hint.id === "artist"
                              ? t("artistName")
                              : hint.id === "popularity"
                              ? t("popularity")
                              : hint.id === "album"
                              ? t("album")
                              : hint.id === "year"
                              ? t("releaseYear")
                              : hint.label}
                          </span>
                        </div>

                        {!isUsed ? (
                          <button
                            onClick={() => revealHint(hint.id)}
                            disabled={gameOver}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
                          >
                            {tGame("revealHint")}
                          </button>
                        ) : (
                          <span className="text-xs text-blue-700 font-medium">
                            {hint.id === "albumCover"
                              ? "Album Revealed!"
                              : hint.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <ResultsDialog
          open={showStats}
          gameData={gameData}
          stats={getGameStats()}
          onRestart={resetGame}
        />
      </div>
    </div>
  );
}
