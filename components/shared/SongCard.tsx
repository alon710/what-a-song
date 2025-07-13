"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Music, Clock, Trophy, Calendar } from "lucide-react";
import { SpotifyTrack } from "@/types";

interface SongCardProps {
  song: SpotifyTrack;
}

export default function SongCard({ song }: SongCardProps) {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  const albumImage =
    song.album.images.find((img) => img.width >= 300) || song.album.images[0];

  return (
    <Card className="overflow-hidden shadow-2xl">
      <div className="md:flex">
        {/* Album Cover */}
        <div className="md:w-1/2">
          {albumImage && (
            <img
              src={albumImage.url}
              alt={`${song.album.name} cover`}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Song Info */}
        <div className="md:w-1/2 p-8">
          <CardHeader className="p-0 mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="mb-2">
                Track ID: {song.id}
              </Badge>
              {song.explicit && <Badge variant="destructive">Explicit</Badge>}
            </div>
            <CardTitle className="text-3xl font-bold mb-2">
              {song.name}
            </CardTitle>
            <CardDescription className="text-lg">
              by {song.artists.map((artist) => artist.name).join(", ")}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                <span className="font-medium">Album:</span>
                <span>{song.album.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Duration:</span>
                <span>{formatDuration(song.duration_ms)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Release:</span>
                <span>{new Date(song.album.release_date).getFullYear()}</span>
              </div>

              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span className="font-medium">Popularity:</span>
                <Badge variant="outline">{song.popularity}/100</Badge>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {song.preview_url && (
                <Button asChild>
                  <a
                    href={song.preview_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Music className="w-4 h-4 mr-2" />
                    Preview
                  </a>
                </Button>
              )}

              <Button variant="outline" asChild>
                <a
                  href={song.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Spotify
                </a>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
