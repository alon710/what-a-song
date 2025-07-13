"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Clock, Trophy, Calendar } from "lucide-react";
import { SpotifyTrack } from "@/types";

interface SelectedSongInfoProps {
  song: SpotifyTrack;
}

export default function SelectedSongInfo({ song }: SelectedSongInfoProps) {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Song</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          {song.album.images[0] && (
            <img
              src={song.album.images[0].url}
              alt={song.album.name}
              className="w-20 h-20 rounded"
            />
          )}
          <div>
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
            {formatDuration(song.duration_ms)}
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            {song.popularity}/100
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(song.album.release_date).getFullYear()}
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Spotify
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
