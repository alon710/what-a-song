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
import { Music, Gamepad2, Settings } from "lucide-react";
import Link from "next/link";
import SongCard from "@/components/shared/SongCard";
import { SpotifyTrack } from "@/types";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">🎵 What a Song</h1>

          <div className="flex gap-3">
            <Link href="/game">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Play Game
              </Button>
            </Link>

            <Link href="/admin">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <Settings className="w-5 h-5 mr-2" />
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>

        <SongCard song={song} />
      </div>
    </div>
  );
}
