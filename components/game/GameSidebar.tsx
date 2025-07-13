"use client";

import { Hint } from "@/types";
import AlbumCover from "./AlbumCover";
import HintsSection from "./HintsSection";
import GameStatsCard from "./GameStatsCard";

interface GameSidebarProps {
  albumCover?: string;
  albumName: string;
  hints: Hint[];
  usedHints: string[];
  onUseHint: (hintId: string) => void;
  hintsUsed: number;
  linesRevealed: number;
  timeElapsed: number;
  triesLeft: number;
  gameOver: boolean;
  isAlbumBlurred: boolean;
}

export default function GameSidebar({
  albumCover,
  albumName,
  hints,
  usedHints,
  onUseHint,
  hintsUsed,
  linesRevealed,
  timeElapsed,
  triesLeft,
  gameOver,
  isAlbumBlurred,
}: GameSidebarProps) {
  return (
    <div className="space-y-6">
      <AlbumCover
        albumCover={albumCover}
        albumName={albumName}
        isBlurred={isAlbumBlurred}
      />
      <HintsSection
        hints={hints}
        usedHints={usedHints}
        onUseHint={onUseHint}
        disabled={gameOver}
      />
      <GameStatsCard
        hintsUsed={hintsUsed}
        linesRevealed={linesRevealed}
        timeElapsed={timeElapsed}
        triesLeft={triesLeft}
      />
    </div>
  );
}
