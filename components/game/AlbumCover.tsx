"use client";

import { Card, CardContent } from "@/components/ui/card";

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
            className={`w-full rounded-lg transition-all duration-500 ${
              isBlurred ? "filter blur-lg" : ""
            }`}
          />
          {isBlurred && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <div className="text-white text-center p-4">
                <div className="text-2xl mb-2">🖼️</div>
                <div className="text-sm font-medium">Album Cover Hidden</div>
                <div className="text-xs opacity-75">Use hint to reveal</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
