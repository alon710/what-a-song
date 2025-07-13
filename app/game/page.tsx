"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Eye,
  Music,
  Calendar,
  Users,
  Trophy,
  Lightbulb,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { GameData } from "@/lib/firebase";

interface GameStats {
  hintsUsed: number;
  linesRevealed: number;
  timeElapsed: number;
  gameWon: boolean;
}

export default function Game() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [revealedLines, setRevealedLines] = useState(1);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/games/random");
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setGameData(data.game);
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
  };

  useEffect(() => {
    loadGame();
  }, []);

  const availableHints = gameData
    ? [
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
    if (!gameData) return;
    const isCorrect =
      currentGuess.toLowerCase().trim() === gameData.songTitle.toLowerCase();
    setGameWon(isCorrect);
    setGameOver(true);
    setShowStats(true);
  };

  const revealNextLine = () => {
    if (gameData && revealedLines < gameData.translatedLyrics.length) {
      setRevealedLines((prev) => prev + 1);
    }
  };

  const useHint = (hintId: string) => {
    if (!usedHints.includes(hintId)) {
      setUsedHints((prev) => [...prev, hintId]);
    }
  };

  const getGameStats = (): GameStats => ({
    hintsUsed: usedHints.length,
    linesRevealed: revealedLines,
    timeElapsed: Math.floor((Date.now() - gameStartTime) / 1000),
    gameWon,
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center space-y-4">
          <Music className="w-8 h-8 animate-spin mx-auto text-white" />
          <p className="text-lg text-white">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-96">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  No Games Available
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{error}</p>
                <p className="text-sm text-muted-foreground">
                  Create some games in the admin panel to start playing!
                </p>
                <Link href="/admin">
                  <Button className="w-full">Go to Admin Panel</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!gameData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            🎮 Lyric Translation Game
          </h1>
          <Link href="/admin">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Admin Panel
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Song Lines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Translated Lyrics
                </CardTitle>
                <CardDescription>
                  Guess the song title from these translated lyrics (
                  {gameData.originalLanguage === "en" ? "Hebrew" : "English"})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {gameData.translatedLyrics
                  .slice(0, revealedLines)
                  .map((line, index) => (
                    <div key={index} className="p-4 bg-slate-100 rounded-lg">
                      <p className="text-lg font-medium">{line}</p>
                    </div>
                  ))}

                <div className="flex justify-between items-center">
                  <Badge variant="outline">
                    {revealedLines} of {gameData.translatedLyrics.length} lines
                    revealed
                  </Badge>

                  {revealedLines < gameData.translatedLyrics.length && (
                    <Button variant="outline" onClick={revealNextLine}>
                      <Eye className="w-4 h-4 mr-2" />
                      Reveal Next Line
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Guess Input */}
            <Card>
              <CardHeader>
                <CardTitle>Your Guess</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter the song title..."
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value)}
                  disabled={gameOver}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !gameOver && checkGuess()
                  }
                />
                <Button
                  onClick={checkGuess}
                  disabled={gameOver || !currentGuess.trim()}
                  className="w-full"
                >
                  Submit Guess
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Album Cover */}
            <Card>
              <CardContent className="p-4">
                <img
                  src={
                    gameData.albumCover ||
                    "https://via.placeholder.com/300x300/4338ca/ffffff?text=Album"
                  }
                  alt="Album cover"
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Hints */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Hints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableHints.map((hint) => {
                  const isUsed = usedHints.includes(hint.id);
                  const Icon = hint.icon;

                  return (
                    <div
                      key={hint.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{hint.label}</span>
                      </div>

                      {isUsed ? (
                        <Badge variant="secondary">{hint.value}</Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => useHint(hint.id)}
                          disabled={gameOver}
                        >
                          Reveal
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Game Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Current Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Hints Used:</span>
                  <Badge>{usedHints.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Lines Revealed:</span>
                  <Badge>{revealedLines}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <Badge>
                    {formatTime(
                      Math.floor((Date.now() - gameStartTime) / 1000)
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Game Over Dialog */}
        <Dialog open={showStats} onOpenChange={setShowStats}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {gameWon ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    Congratulations! 🎉
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-500" />
                    Game Over
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {gameWon
                  ? `You correctly guessed "${gameData.songTitle}" by ${gameData.artist}!`
                  : `The correct answer was "${gameData.songTitle}" by ${gameData.artist}.`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-100 rounded-lg">
                  <p className="text-2xl font-bold">
                    {getGameStats().hintsUsed}
                  </p>
                  <p className="text-sm text-muted-foreground">Hints Used</p>
                </div>
                <div className="text-center p-4 bg-slate-100 rounded-lg">
                  <p className="text-2xl font-bold">
                    {getGameStats().linesRevealed}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Lines Revealed
                  </p>
                </div>
              </div>

              <div className="text-center p-4 bg-slate-100 rounded-lg">
                <p className="text-2xl font-bold">
                  {formatTime(getGameStats().timeElapsed)}
                </p>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </div>

              <Button onClick={resetGame} className="w-full">
                Play Again
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
