"use client";

import { useState, useTransition, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createGameWithRedirect, CreateGameData } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { SpotifyTrack } from "@/types";

// Import our reusable components
import SearchSongs from "@/components/admin/SearchSongs";
import AcceptableAnswers from "@/components/admin/AcceptableAnswers";
import LanguageSettings from "@/components/admin/LanguageSettings";
import LyricsInput from "@/components/admin/LyricsInput";
import SelectedSongInfo from "@/components/admin/SelectedSongInfo";
import SuccessMessage from "@/components/admin/SuccessMessage";
import SaveGameButton from "@/components/admin/SaveGameButton";

function AdminContent() {
  const searchParams = useSearchParams();
  const [selectedSong, setSelectedSong] = useState<SpotifyTrack | null>(null);
  const [translatedLyrics, setTranslatedLyrics] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [originalLanguage, setOriginalLanguage] = useState<"en" | "he">("en");
  const [acceptableAnswers, setAcceptableAnswers] = useState<string[]>([""]);
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      // Hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSongSelect = (song: SpotifyTrack) => {
    setSelectedSong(song);
    // Reset lyrics
    setTranslatedLyrics(["", "", "", "", ""]);
    // Auto-populate first acceptable answer with song title
    setAcceptableAnswers([song.name]);
  };

  const saveGame = async () => {
    if (!selectedSong) return;

    const filteredTranslated = translatedLyrics.filter(
      (line) => line.trim() !== ""
    );

    if (filteredTranslated.length === 0) {
      alert("Please add at least one line of translated lyrics");
      return;
    }

    const filteredAnswers = acceptableAnswers.filter(
      (answer) => answer.trim() !== ""
    );
    if (filteredAnswers.length === 0) {
      alert("Please add at least one acceptable answer for the song");
      return;
    }

    const gameData: CreateGameData = {
      songTitle: selectedSong.name,
      acceptableAnswers: filteredAnswers,
      artist: selectedSong.artists.map((a) => a.name).join(", "),
      album: selectedSong.album.name,
      releaseYear: new Date(selectedSong.album.release_date).getFullYear(),
      popularity: selectedSong.popularity,
      albumCover: selectedSong.album.images[0]?.url || "",
      originalLanguage,
      spotifyId: selectedSong.id,
      spotifyUrl: selectedSong.external_urls.spotify,
      translatedLyrics: filteredTranslated,
    };

    startTransition(async () => {
      try {
        await createGameWithRedirect(gameData);
        // The createGameWithRedirect function will handle the redirect
        // Reset state will happen after redirect
        setSelectedSong(null);
        setTranslatedLyrics(["", "", "", "", ""]);
        setAcceptableAnswers([""]);
      } catch (error) {
        alert("Failed to save game. Please try again.");
      }
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🎵 Admin Panel - Create Game
        </h1>

        <SuccessMessage show={showSuccess} />

        <div className="grid grid-cols-1 gap-8">
          {/* Left Column - Song Search */}
          <div className="space-y-6">
            <SearchSongs onSongSelect={handleSongSelect} />
            {selectedSong && <SelectedSongInfo song={selectedSong} />}
          </div>

          {/* Right Column - Game Configuration */}
          <div className="space-y-6">
            {selectedSong && (
              <>
                <LanguageSettings
                  originalLanguage={originalLanguage}
                  onLanguageChange={setOriginalLanguage}
                />
                <AcceptableAnswers
                  acceptableAnswers={acceptableAnswers}
                  onUpdate={setAcceptableAnswers}
                  selectedSong={selectedSong}
                />
                <LyricsInput
                  translatedLyrics={translatedLyrics}
                  originalLanguage={originalLanguage}
                  onUpdate={setTranslatedLyrics}
                />
                <SaveGameButton onSave={saveGame} isPending={isPending} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              🎵 Admin Panel - Loading...
            </h1>
          </div>
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
