"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { SpotifyTrack, SongWithLyrics } from "@/types";
import Image from "next/image";

interface SearchSongsProps {
  onSongSelect: (song: SongWithLyrics) => void;
}

export default function SearchSongs({ onSongSelect }: SearchSongsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("admin.searchSongs");

  const searchSongs = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/spotify-search?q=${encodeURIComponent(searchQuery)}&limit=10`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.tracks) {
        setSearchResults(data.tracks);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongSelect = (song: SpotifyTrack) => {
    // Simply convert SpotifyTrack to SongWithLyrics format and redirect
    // The edit page will handle fetching lyrics and other data
    const songWithLyrics: SongWithLyrics = {
      ...song,
      // Don't fetch lyrics here - let the edit page handle it
    };

    onSongSelect(songWithLyrics);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-start">
          <Search className="w-5 h-5" />
          {t("title")}
        </CardTitle>
        <CardDescription className="text-start">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder={t("placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchSongs()}
            className="text-start"
          />
          <Button onClick={searchSongs} disabled={loading}>
            {loading ? "..." : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2 overflow-y-auto">
            {searchResults.map((song) => (
              <Card
                key={song.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => handleSongSelect(song)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {song.album.images[0] && (
                      <Image
                        src={song.album.images[0].url}
                        alt={song.album.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded"
                      />
                    )}
                    <div className="flex-1 text-start">
                      <h3 className="font-medium">{song.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {song.artists.map((a) => a.name).join(", ")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
