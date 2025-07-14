"use client";

import { useState, useTransition, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createGameWithRedirect, CreateGameData } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { SpotifyTrack } from "@/types";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 text-center">
          🎵 Admin Panel - Create Game
        </h1>

        <SuccessMessage show={showSuccess} />

        {/* Mobile-first layout: Single column on mobile, side-by-side on larger screens */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Song Search - Always first */}
          <div className="w-full">
            <SearchSongs onSongSelect={handleSongSelect} />
          </div>

          {/* Selected Song Info - Second on mobile */}
          {selectedSong && (
            <div className="w-full">
              <SelectedSongInfo song={selectedSong} />
            </div>
          )}

          {/* Game Configuration - Stack vertically on mobile, optimize for touch */}
          {selectedSong && (
            <div className="space-y-4 sm:space-y-6">
              <div className="w-full">
                <LanguageSettings
                  originalLanguage={originalLanguage}
                  onLanguageChange={setOriginalLanguage}
                />
              </div>

              <div className="w-full">
                <AcceptableAnswers
                  acceptableAnswers={acceptableAnswers}
                  onUpdate={setAcceptableAnswers}
                  selectedSong={selectedSong}
                />
              </div>

              <div className="w-full">
                <LyricsInput
                  translatedLyrics={translatedLyrics}
                  originalLanguage={originalLanguage}
                  onUpdate={setTranslatedLyrics}
                />
              </div>

              <div className="w-full">
                <SaveGameButton onSave={saveGame} isPending={isPending} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <Suspense
        fallback={
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 text-center">
                🎵 Admin Panel - Loading...
              </h1>
            </div>
          </div>
        }
      >
        <AdminContent />
      </Suspense>
    </ProtectedRoute>
  );
}
