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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getHintDisplayText = (hint: Hint, isUsed: boolean) => {
    if (!isUsed) {
      const labels: { [key: string]: string } = {
        albumCover: t("albumCover"),
        artist: t("artistName"),
        popularity: t("popularity"),
        album: t("album"),
        year: t("releaseYear"),
      };
      return labels[hint.id] || hint.label;
    }

    if (hint.id === "albumCover") {
      return "✓ Revealed";
    }

    return truncateText(hint.value, 10);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      {hints.map((hint) => {
        const isUsed = usedHints.includes(hint.id);
        const Icon = hint.icon;
        const displayText = getHintDisplayText(hint, isUsed);

        return (
          <button
            key={hint.id}
            onClick={() => onRevealHint(hint.id)}
            disabled={isUsed}
            title={isUsed && hint.id !== "albumCover" ? hint.value : undefined}
            className={`group relative flex flex-col items-center justify-center gap-1 h-16 sm:h-18 w-full rounded-xl text-xs font-medium transition-all duration-300 shadow-sm border ${
              isUsed
                ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 text-emerald-700 cursor-default"
                : "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-blue-400 hover:shadow-md hover:scale-105 active:scale-95"
            }`}
          >
            {/* Icon */}
            <div
              className={`flex items-center justify-center w-5 h-5 rounded-full ${
                isUsed
                  ? "bg-emerald-100"
                  : "bg-white/20 group-hover:bg-white/30"
              }`}
            >
              <Icon
                className={`w-3 h-3 ${
                  isUsed ? "text-emerald-600" : "text-white"
                }`}
              />
            </div>

            {/* Text */}
            <span
              className={`text-center leading-tight text-[9px] sm:text-[10px] font-medium px-1 ${
                isUsed ? "text-emerald-700" : "text-white"
              }`}
            >
              {displayText}
            </span>

            {/* Used indicator */}
            {isUsed && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">✓</span>
              </div>
            )}

            {/* Hover effect for unused hints */}
            {!isUsed && (
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}
          </button>
        );
      })}
    </div>
  );
}
