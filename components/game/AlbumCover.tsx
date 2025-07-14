"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface AlbumCoverProps {
  albumCover?: string;
  albumName: string;
  isBlurred?: boolean;
}

export default function AlbumCover({
  albumCover,
  albumName,
  isBlurred = false,
}: AlbumCoverProps) {
  const t = useTranslations("game.albumCover");

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="relative">
          <img
            src={
              albumCover ||
              "https://via.placeholder.com/300x300/4338ca/ffffff?text=Album"
            }
            alt={`${albumName} cover`}
            className={`w-full rounded-lg transition-all duration-700 ease-out transform ${
              isBlurred
                ? "filter blur-lg scale-105"
                : "filter blur-none scale-100"
            }`}
          />
          {isBlurred && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg backdrop-blur-sm">
              <div className="text-white text-center p-4 bg-black/40 rounded-lg border border-white/20">
                <div className="text-3xl mb-2">🖼️</div>
                <div className="text-sm font-bold mb-1">{t("hidden")}</div>
                <div className="text-xs opacity-90">{t("useHint")}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
