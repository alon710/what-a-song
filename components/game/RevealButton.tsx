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
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
    >
      {tGame("lyricsDisplay.revealNext")}
    </button>
  );
}
