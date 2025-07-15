"use client";

import {
  Music,
  Calendar,
  Trophy,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { SongData } from "@/lib/firebase";
import { Hint } from "@/types";

import GameHeader from "@/components/game/GameHeader";
import HintsGrid from "@/components/game/HintsGrid";
import AlbumCover from "@/components/game/AlbumCover";
import LyricsDisplay from "@/components/game/LyricsDisplay";
import GameControls from "@/components/game/GameControls";
import AttemptsHistory from "@/components/game/AttemptsHistory";
import RevealButton from "@/components/game/RevealButton";

interface GameplayScreenProps {
  songData: SongData;
  currentGuess: string;
  revealedLines: number;
  usedHints: string[];
  timeElapsed: number;
  gameOver: boolean;
  triesLeft: number;
  attempts: string[];
  isAlbumBlurred: boolean;
  onGuessChange: (guess: string) => void;
  onSubmitGuess: () => void;
  onRevealNextLine: () => void;
  onRevealHint: (hintId: string) => void;
}

export default function GameplayScreen({
  songData,
  currentGuess,
  revealedLines,
  usedHints,
  timeElapsed,
  gameOver,
  triesLeft,
  attempts,
  isAlbumBlurred,
  onGuessChange,
  onSubmitGuess,
  onRevealNextLine,
  onRevealHint,
}: GameplayScreenProps) {
  const t = useTranslations("game.hints");

  const availableHints: Hint[] = [
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
  ];

  return (
    <div className="space-y-4 py-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
        {/* Game Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <GameHeader
            timeElapsed={timeElapsed}
            triesLeft={triesLeft}
            hintsUsed={usedHints.length}
            totalHints={availableHints.length}
          />
        </div>

        {/* Hints Grid - Only show when game is active */}
        {!gameOver && (
          <div className="p-4 border-b border-gray-100">
            <HintsGrid
              hints={availableHints}
              usedHints={usedHints}
              onRevealHint={onRevealHint}
            />
          </div>
        )}

        {/* Album Cover */}
        <AlbumCover
          src={songData.albumCover}
          alt="Album cover"
          isBlurred={isAlbumBlurred}
        />

        {/* Game Content */}
        <div className="p-4 space-y-4">
          <LyricsDisplay
            lyrics={songData.translatedLyrics}
            revealedLines={revealedLines}
          />

          <RevealButton
            onRevealNext={onRevealNextLine}
            canReveal={
              revealedLines < songData.translatedLyrics.length && !gameOver
            }
          />

          {!gameOver && (
            <GameControls
              currentGuess={currentGuess}
              onGuessChange={onGuessChange}
              onSubmitGuess={onSubmitGuess}
              disabled={gameOver}
            />
          )}

          <AttemptsHistory attempts={attempts} />
        </div>
      </div>
    </div>
  );
}
