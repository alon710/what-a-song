import { useTranslations } from "next-intl";
import { Hint } from "@/types";

interface HintsGridProps {
  hints: Hint[];
  usedHints: string[];
  onRevealHint: (hintId: string) => void;
}

export default function HintsGrid({
  hints,
  usedHints,
  onRevealHint,
}: HintsGridProps) {
  const t = useTranslations("game.hints");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-2">
      {hints.map((hint) => {
        const isUsed = usedHints.includes(hint.id);
        const Icon = hint.icon;

        return (
          <button
            key={hint.id}
            onClick={() => onRevealHint(hint.id)}
            disabled={isUsed}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${
              isUsed
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-center leading-tight">
              {isUsed
                ? hint.id === "albumCover"
                  ? "Revealed!"
                  : hint.value
                : hint.id === "albumCover"
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
          </button>
        );
      })}
    </div>
  );
}
