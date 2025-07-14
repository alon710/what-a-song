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
        <div className="flex items-center gap-4 mb-4">
          {song.album.images[0] && (
            <Image
              src={song.album.images[0].url}
              alt={song.album.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded"
            />
          )}
          <div className="text-start">
            <h3 className="text-lg font-bold">{song.name}</h3>
            <p className="text-muted-foreground">
              {song.artists.map((a) => a.name).join(", ")}
            </p>
            <p className="text-sm">{song.album.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(song.duration_ms)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>{song.popularity}/100</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(song.album.release_date).getFullYear()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span>{t("source")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
