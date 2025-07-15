"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Clock, Trophy, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { SpotifyTrack } from "@/types";
import Image from "next/image";

interface SelectedSongInfoProps {
  song: SpotifyTrack;
}

export default function SelectedSongInfo({ song }: SelectedSongInfoProps) {
  const t = useTranslations("admin.selectedSong");

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-start">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          {song.album.images[0] && (
            <Image
              src={song.album.images[0].url}
              alt={song.album.name}
              width={64}
              height={64}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded"
            />
          )}
          <div className="text-start min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold truncate">
              {song.name}
            </h3>
            <p className="text-muted-foreground text-sm truncate">
              {song.artists.map((a) => a.name).join(", ")}
            </p>
            <p className="text-xs sm:text-sm truncate">{song.album.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{formatDuration(song.duration_ms)}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{song.popularity}/100</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">
              {new Date(song.album.release_date).getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <Music className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{t("source")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
