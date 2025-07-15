"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { SongData, ScoreData } from "@/lib/firebase";
import { getSongById } from "@/lib/songs";
import { saveScore, getUserScoreForSong, SaveScoreData } from "@/lib/scores";
import { useAuth } from "@/components/shared/AuthProvider";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import ResultsDialog from "@/components/game/ResultsDialog";
import WaitingScreen from "@/components/game/WaitingScreen";
import GameplayScreen from "@/components/game/GameplayScreen";

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

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!songData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4">
      <div className="max-w-lg mx-auto">
        {/* Component 1: Before Started */}
        {hasAlreadyPlayed && userPreviousScore ? (
          <ResultsDialog
            open={true}
            songData={songData}
            previousScore={userPreviousScore}
            mode={userHasWon ? "justWon" : "justPlayed"}
          />
        ) : !gameStarted ? (
          <WaitingScreen songData={songData} onStartGame={startGame} />
        ) : (
          /* Component 2: While Playing */
          <GameplayScreen
            songData={songData}
            currentGuess={currentGuess}
            revealedLines={revealedLines}
            usedHints={usedHints}
            timeElapsed={timeElapsed}
            gameOver={gameOver}
            triesLeft={triesLeft}
            attempts={attempts}
            isAlbumBlurred={isAlbumBlurred}
            onGuessChange={setCurrentGuess}
            onSubmitGuess={checkGuess}
            onRevealNextLine={revealNextLine}
            onRevealHint={revealHint}
          />
        )}

        {/* Component 3: When Done */}
        <ResultsDialog
          open={showStats}
          songData={songData}
          mode={userHasWon ? "justWon" : "justPlayed"}
        />
      </div>
    </div>
  );
}
