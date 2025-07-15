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
import { Search, Music } from "lucide-react";
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
  const [fetchingLyrics, setFetchingLyrics] = useState<string | null>(null);
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

  const fetchLyrics = async (song: SpotifyTrack): Promise<SongWithLyrics> => {
    const artistName = song.artists.map((a) => a.name).join(", ");

    try {
      const res = await fetch(
        `/api/genius-lyrics?title=${encodeURIComponent(
          song.name
        )}&artist=${encodeURIComponent(artistName)}`
      );
      const data = await res.json();

      if (data.success && data.lyrics) {
        return {
          ...song,
          originalLyrics: data.lyrics,
        };
      } else {
        return {
          ...song,
          lyricsError: t("lyricsNotFound"),
        };
      }
    } catch (error) {
      console.error("Failed to fetch lyrics:", error);
      return {
        ...song,
        lyricsError: t("lyricsFetchFailed"),
      };
    }
  };

  const handleSongSelect = async (song: SpotifyTrack) => {
    setFetchingLyrics(song.id);

    try {
      const songWithLyrics = await fetchLyrics(song);
      onSongSelect(songWithLyrics);
      setSearchResults([]);
      setSearchQuery("");
    } catch (error) {
      console.error("Error selecting song:", error);
      // Still pass the song even if lyrics fetch failed
      onSongSelect(song);
      setSearchResults([]);
      setSearchQuery("");
    } finally {
      setFetchingLyrics(null);
    }
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
                    <div className="flex items-center gap-2">
                      {fetchingLyrics === song.id ? (
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <Music className="w-4 h-4 animate-spin" />
                          {t("fetchingLyrics")}
                        </div>
                      ) : (
                        <Button size="sm">{t("select")}</Button>
                      )}
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
