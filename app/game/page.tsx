"use client";

import { useState, useEffect } from "react";
import { Music, Calendar, Trophy, Users, Image } from "lucide-react";
import { GameData } from "@/lib/firebase";
import { getRandomGame } from "@/lib/actions";
import { GameStats, Hint } from "@/types";

// Import our reusable components
import LoadingState from "@/components/game/LoadingState";
import ErrorState from "@/components/game/ErrorState";
import GameLayout from "@/components/game/GameLayout";
import LyricsDisplay from "@/components/game/LyricsDisplay";
import GuessInput from "@/components/game/GuessInput";
import AttemptsDisplay from "@/components/game/AttemptsDisplay";
import GameSidebar from "@/components/game/GameSidebar";
import ResultsDialog from "@/components/game/ResultsDialog";

export default function Game() {
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
  const [triesLeft, setTriesLeft] = useState(5);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [isAlbumBlurred, setIsAlbumBlurred] = useState(true);

  const loadGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRandomGame();

      if (!result.success || !result.game) {
        throw new Error(result.error || "No game data received");
      }

      setGameData(result.game);
      setGameStartTime(Date.now());
      resetGameState();
    } catch (error: any) {
      setError(error.message || "Failed to load game");
    } finally {
      setLoading(false);
    }
  };

  const resetGameState = () => {
    setCurrentGuess("");
    setRevealedLines(1);
    setUsedHints([]);
    setGameWon(false);
    setGameOver(false);
    setShowStats(false);
    setTimeElapsed(0);
    setTriesLeft(5);
    setAttempts([]);
    setIsAlbumBlurred(true);
  };

  // Automatic timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameStartTime > 0 && !gameOver && !loading) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameStartTime, gameOver, loading]);

  useEffect(() => {
    loadGame();
  }, []);

  const availableHints: Hint[] = gameData
    ? [
        {
          id: "albumCover",
          label: "Album Cover",
          icon: Image,
          value: "Reveal album artwork",
        },
        {
          id: "artist",
          label: "Artist Name",
          icon: Users,
          value: gameData.artist,
        },
        {
          id: "popularity",
          label: "Popularity",
          icon: Trophy,
          value: `${gameData.popularity}/100`,
        },
        { id: "album", label: "Album", icon: Music, value: gameData.album },
        {
          id: "year",
          label: "Release Year",
          icon: Calendar,
          value: gameData.releaseYear.toString(),
        },
      ]
    : [];

  const checkGuess = () => {
    if (!gameData || gameOver || triesLeft <= 0) return;

    const guessLower = currentGuess.toLowerCase().trim();
    if (!guessLower) return;

    // Add attempt to history
    const newAttempts = [...attempts, currentGuess];
    setAttempts(newAttempts);

    // Check against all acceptable answers
    const isCorrect =
      gameData.acceptableAnswers?.some(
        (answer) => answer.toLowerCase().trim() === guessLower
      ) || gameData.songTitle.toLowerCase().trim() === guessLower; // Fallback to songTitle for backward compatibility

    const newTriesLeft = triesLeft - 1;
    setTriesLeft(newTriesLeft);
    setCurrentGuess("");

    if (isCorrect) {
      setGameWon(true);
      setGameOver(true);
      setShowStats(true);
    } else if (newTriesLeft <= 0) {
      // Game over - no more tries
      setGameWon(false);
      setGameOver(true);
      setShowStats(true);
    }
  };

  const revealNextLine = () => {
    if (gameData && revealedLines < gameData.translatedLyrics.length) {
      setRevealedLines((prev) => prev + 1);
    }
  };

  const useHint = (hintId: string) => {
    if (!usedHints.includes(hintId)) {
      setUsedHints((prev) => [...prev, hintId]);

      // Handle special hint effects
      if (hintId === "albumCover") {
        setIsAlbumBlurred(false);
      }
    }
  };

  const getGameStats = (): GameStats => ({
    hintsUsed: usedHints.length,
    linesRevealed: revealedLines,
    timeElapsed,
    gameWon,
    triesUsed: 5 - triesLeft,
    attempts,
  });

  const resetGame = () => {
    loadGame();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!gameData) return null;

  return (
    <GameLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-2 space-y-6">
          <LyricsDisplay
            lyrics={gameData.translatedLyrics}
            revealedLines={revealedLines}
            onRevealNext={revealNextLine}
            canRevealMore={revealedLines < gameData.translatedLyrics.length}
            originalLanguage={gameData.originalLanguage}
          />
          <AttemptsDisplay attempts={attempts} triesLeft={triesLeft} />
          <GuessInput
            guess={currentGuess}
            onGuessChange={setCurrentGuess}
            onSubmit={checkGuess}
            disabled={gameOver}
            triesLeft={triesLeft}
          />
        </div>

        {/* Sidebar */}
        <GameSidebar
          albumCover={gameData.albumCover}
          albumName={gameData.album}
          hints={availableHints}
          usedHints={usedHints}
          onUseHint={useHint}
          hintsUsed={usedHints.length}
          linesRevealed={revealedLines}
          timeElapsed={timeElapsed}
          triesLeft={triesLeft}
          gameOver={gameOver}
          isAlbumBlurred={isAlbumBlurred}
        />
      </div>

      <ResultsDialog
        open={showStats}
        gameData={gameData}
        stats={getGameStats()}
        onRestart={resetGame}
      />
    </GameLayout>
  );
}
