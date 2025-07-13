"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Music, Clock } from "lucide-react";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
    release_date: string;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
  popularity: number;
  explicit: boolean;
}

export default function Home() {
  const [song, setSong] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const songName = "מה עם שאזאמאט";
        const res = await fetch(`/api/spotify-search?q=${songName}&limit=1`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        if (data.tracks && data.tracks.length > 0) {
          setSong(data.tracks[0]);
        } else {
          throw new Error("No songs found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch song");
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Music className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-lg">Loading song...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No song found</p>
      </div>
    );
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  const albumImage =
    song.album.images.find((img) => img.width >= 300) || song.album.images[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🎵 What a Song
        </h1>

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
                  {song.explicit && (
                    <Badge variant="destructive">Explicit</Badge>
                  )}
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
                    <span className="font-medium">Release:</span>
                    <span>
                      {new Date(song.album.release_date).getFullYear()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
}
