import { useTranslations } from "next-intl";

interface GameHeaderProps {
  timeElapsed: number;
  triesLeft: number;
}

export default function GameHeader({
  timeElapsed,
  triesLeft,
}: GameHeaderProps) {
  const t = useTranslations("game.gameHeader");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-xs text-gray-500 text-center">
      {formatTime(timeElapsed)} •{" "}
      {t("triesRemaining", { triesLeft, maxTries: 3 })}
    </div>
  );
}
