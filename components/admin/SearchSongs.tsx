"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { SpotifyTrack, SongWithLyrics } from "@/types";
import SongCard from "@/components/shared/SongCard";

interface SearchSongsProps {
  onSongSelect: (song: SongWithLyrics) => void;
}

interface SearchResponse {
  tracks: SpotifyTrack[];
  total: number;
  hasMore: boolean;
  error?: string;
}

export default function SearchSongs({ onSongSelect }: SearchSongsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const observerTarget = useRef<HTMLDivElement>(null);
  const t = useTranslations("admin.searchSongs");

  const limit = 10;

  const searchSongs = async (
    query: string,
    offset: number = 0,
    append: boolean = false
  ) => {
    if (!query.trim()) return;

    if (!append) {
      setLoading(true);
      setSearchResults([]);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await fetch(
        `/api/spotify-search?q=${encodeURIComponent(
          query
        )}&limit=${limit}&offset=${offset}`
      );
      const data: SearchResponse = await res.json();

      if (data.error) throw new Error(data.error);

      if (append) {
        setSearchResults((prev) => [...prev, ...data.tracks]);
      } else {
        setSearchResults(data.tracks);
        setCurrentQuery(query);
      }

      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && currentQuery) {
      searchSongs(currentQuery, searchResults.length, true);
    }
  }, [hasMore, loadingMore, currentQuery, searchResults.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, loadingMore]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    searchSongs(searchQuery, 0, false);
  };

  const handleSongSelect = (song: SpotifyTrack) => {
    const songWithLyrics: SongWithLyrics = {
      ...song,
    };

    onSongSelect(songWithLyrics);
    setSearchResults([]);
    setSearchQuery("");
    setCurrentQuery("");
    setHasMore(false);
  };

  return (
    <div className="space-y-6">
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
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="text-start"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {searchResults.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    onClick={() => handleSongSelect(song)}
                  />
                ))}
              </div>

              {/* Infinite scroll trigger and loading indicator */}
              <div ref={observerTarget} className="flex justify-center py-4">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading more...</span>
                  </div>
                )}
                {!hasMore && searchResults.length > 0 && (
                  <p className="text-sm text-gray-500">No more results</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
