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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Save,
  AlertTriangle,
  Music,
  Clock,
  Calendar,
  Trophy,
} from "lucide-react";

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
  external_urls: { spotify: string };
  popularity: number;
}

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [selectedSong, setSelectedSong] = useState<SpotifyTrack | null>(null);
  const [originalLyrics, setOriginalLyrics] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [translatedLyrics, setTranslatedLyrics] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [originalLanguage, setOriginalLanguage] = useState<"en" | "he">("en");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const searchSongs = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/spotify-search?q=${encodeURIComponent(searchQuery)}&limit=10`
      );
      const data = await res.json();
      if (data.tracks) {
        setSearchResults(data.tracks);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectSong = (song: SpotifyTrack) => {
    setSelectedSong(song);
    setSearchResults([]);
    setSearchQuery("");
    // Reset lyrics
    setOriginalLyrics(["", "", "", "", ""]);
    setTranslatedLyrics(["", "", "", "", ""]);
  };

  const updateLyricLine = (
    index: number,
    value: string,
    isOriginal: boolean
  ) => {
    if (isOriginal) {
      const newLyrics = [...originalLyrics];
      newLyrics[index] = value;
      setOriginalLyrics(newLyrics);
    } else {
      const newLyrics = [...translatedLyrics];
      newLyrics[index] = value;
      setTranslatedLyrics(newLyrics);
    }
  };

  const saveGame = async () => {
    if (!selectedSong) return;

    const filteredOriginal = originalLyrics.filter(
      (line) => line.trim() !== ""
    );
    const filteredTranslated = translatedLyrics.filter(
      (line) => line.trim() !== ""
    );

    if (filteredOriginal.length === 0 || filteredTranslated.length === 0) {
      alert("Please add at least one line of lyrics in both languages");
      return;
    }

    setSaving(true);
    try {
      const gameData = {
        songTitle: selectedSong.name,
        artist: selectedSong.artists.map((a) => a.name).join(", "),
        album: selectedSong.album.name,
        releaseYear: new Date(selectedSong.album.release_date).getFullYear(),
        popularity: selectedSong.popularity,
        albumCover: selectedSong.album.images[0]?.url || "",
        originalLanguage,
        spotifyId: selectedSong.id,
        spotifyUrl: selectedSong.external_urls.spotify,
        originalLyrics: filteredOriginal,
        translatedLyrics: filteredTranslated,
      };

      const res = await fetch("/api/admin/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameData),
      });

      if (res.ok) {
        alert("Game saved successfully!");
        setSelectedSong(null);
        setOriginalLyrics(["", "", "", "", ""]);
        setTranslatedLyrics(["", "", "", "", ""]);
      } else {
        throw new Error("Failed to save game");
      }
    } catch (error) {
      alert("Failed to save game. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🎵 Admin Panel - Create Game
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Song Search */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Songs
                </CardTitle>
                <CardDescription>
                  Search for songs using Spotify's database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for a song..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchSongs()}
                  />
                  <Button onClick={searchSongs} disabled={loading}>
                    {loading ? "..." : <Search className="w-4 h-4" />}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {searchResults.map((song) => (
                      <Card
                        key={song.id}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => selectSong(song)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {song.album.images[0] && (
                              <img
                                src={song.album.images[0].url}
                                alt={song.album.name}
                                className="w-12 h-12 rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium">{song.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {song.artists.map((a) => a.name).join(", ")}
                              </p>
                            </div>
                            <Button size="sm">Select</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Song Info */}
            {selectedSong && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Song</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    {selectedSong.album.images[0] && (
                      <img
                        src={selectedSong.album.images[0].url}
                        alt={selectedSong.album.name}
                        className="w-20 h-20 rounded"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{selectedSong.name}</h3>
                      <p className="text-muted-foreground">
                        {selectedSong.artists.map((a) => a.name).join(", ")}
                      </p>
                      <p className="text-sm">{selectedSong.album.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatDuration(selectedSong.duration_ms)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      {selectedSong.popularity}/100
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedSong.album.release_date).getFullYear()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      Spotify
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Lyrics Input */}
          <div className="space-y-6">
            {selectedSong && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Language Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label>Original Language</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={
                          originalLanguage === "en" ? "default" : "outline"
                        }
                        onClick={() => setOriginalLanguage("en")}
                      >
                        English
                      </Button>
                      <Button
                        variant={
                          originalLanguage === "he" ? "default" : "outline"
                        }
                        onClick={() => setOriginalLanguage("he")}
                      >
                        Hebrew
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Add Lyrics</CardTitle>
                    <CardDescription>
                      Enter up to 5 lines of lyrics that you have legal rights
                      to use
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Original Lyrics */}
                    <div>
                      <Label className="text-lg font-medium">
                        Original Lyrics (
                        {originalLanguage === "en" ? "English" : "Hebrew"})
                      </Label>
                      <div className="space-y-2 mt-2">
                        {originalLyrics.map((line, index) => (
                          <Input
                            key={index}
                            placeholder={`Line ${index + 1} (optional)`}
                            value={line}
                            onChange={(e) =>
                              updateLyricLine(index, e.target.value, true)
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Translated Lyrics */}
                    <div>
                      <Label className="text-lg font-medium">
                        Translated Lyrics (
                        {originalLanguage === "en" ? "Hebrew" : "English"})
                      </Label>
                      <div className="space-y-2 mt-2">
                        {translatedLyrics.map((line, index) => (
                          <Input
                            key={index}
                            placeholder={`Translated line ${
                              index + 1
                            } (optional)`}
                            value={line}
                            onChange={(e) =>
                              updateLyricLine(index, e.target.value, false)
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={saveGame}
                      disabled={saving}
                      className="w-full"
                      size="lg"
                    >
                      {saving ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Game
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
