import { useTranslations } from "next-intl";

interface AttemptsHistoryProps {
  attempts: string[];
}

export default function AttemptsHistory({ attempts }: AttemptsHistoryProps) {
  const t = useTranslations("game.attemptsHistory");

  if (attempts.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="text-xs text-gray-500 mb-2">{t("title")}</div>
      <div className="flex flex-wrap gap-1">
        {attempts.map((attempt, index) => (
          <span
            key={index}
            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md"
          >
            {attempt}
          </span>
        ))}
      </div>
    </div>
  );
}
