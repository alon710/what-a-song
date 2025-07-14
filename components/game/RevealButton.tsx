import { useTranslations } from "next-intl";

interface RevealButtonProps {
  onRevealNext: () => void;
  canReveal: boolean;
}

export default function RevealButton({
  onRevealNext,
  canReveal,
}: RevealButtonProps) {
  const tGame = useTranslations("game");

  if (!canReveal) return null;

  return (
    <button
      onClick={onRevealNext}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
    >
      {tGame("lyricsDisplay.revealNext")}
    </button>
  );
}
