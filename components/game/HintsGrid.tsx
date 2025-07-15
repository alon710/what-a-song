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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 mb-1 sm:mb-2">
      {hints.map((hint) => {
        const isUsed = usedHints.includes(hint.id);
        const Icon = hint.icon;

        return (
          <button
            key={hint.id}
            onClick={() => onRevealHint(hint.id)}
            disabled={isUsed}
            className={`flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-md sm:rounded-lg text-xs font-medium transition-colors ${
              isUsed
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-center leading-tight text-[10px] sm:text-xs">
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
