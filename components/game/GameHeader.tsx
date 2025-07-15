import { useTranslations } from "next-intl";

interface GameHeaderProps {
  timeElapsed: number;
  triesLeft: number;
  hintsUsed: number;
  totalHints: number;
}

export default function GameHeader({
  timeElapsed,
  triesLeft,
  hintsUsed,
  totalHints,
}: GameHeaderProps) {
  const t = useTranslations("game.gameHeader");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
      <span>{formatTime(timeElapsed)}</span>
      <span>•</span>
      <span>{t("triesRemaining", { triesLeft, maxTries: 3 })}</span>
      <span>•</span>
      <span>{t("hintsUsed", { hintsUsed, totalHints })}</span>
    </div>
  );
}
