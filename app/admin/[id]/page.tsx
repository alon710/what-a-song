"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SongWithLyrics } from "@/types";
import { SongData } from "@/lib/firebase";
import ProtectedPageLayout from "@/components/shared/ProtectedPageLayout";
import { useSuccessMessage } from "@/hooks/useSuccessMessage";

import AcceptableAnswers from "@/components/admin/AcceptableAnswers";
import LanguageSettings from "@/components/admin/LanguageSettings";
import LyricsInput from "@/components/admin/LyricsInput";
import SelectedSongInfo from "@/components/admin/SelectedSongInfo";
import SuccessMessage from "@/components/admin/SuccessMessage";
import SaveGameButton from "@/components/admin/SaveGameButton";
import DatePicker from "@/components/admin/DatePicker";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { CreateSongData, createOrUpdateSong, getSongById } from "@/lib/songs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

function SongEditContent() {
  const params = useParams();
  const router = useRouter();
  const spotifyId = params.id as string; // This is now the Spotify ID
  const t = useTranslations("admin");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [songData, setSongData] = useState<SongWithLyrics | null>(null);
  const [existingSong, setExistingSong] = useState<SongData | null>(null); // Store existing song data if available
  const [translatedLyrics, setTranslatedLyrics] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [originalLanguage, setOriginalLanguage] = useState<"en" | "he">("en");
  const [acceptableAnswers, setAcceptableAnswers] = useState<string[]>([""]);
  const [gameDate, setGameDate] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { showSuccess, triggerSuccess } = useSuccessMessage();

  const loadSongData = useCallback(async () => {
    if (!spotifyId) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Try to load existing song from database
      const dbResult = await getSongById(spotifyId);

      if (dbResult.success && dbResult.song) {
        // Song exists in database, use that data
        const song = dbResult.song;
        setExistingSong(song);

        // Convert SongData to SongWithLyrics format for consistency
        const songWithLyrics: SongWithLyrics = {
          id: song.id, // This is now the Spotify ID
          name: song.songTitle,
          artists: [{ name: song.artist }],
          album: {
            name: song.album,
            images: [{ url: song.albumCover, width: 300, height: 300 }],
            release_date: song.releaseYear.toString(),
          },
          duration_ms: 0, // Not stored in our database
          external_urls: {
            spotify: `https://open.spotify.com/track/${song.spotifyTrackId}`,
          },
          popularity: song.popularity,
          originalLyrics: song.originalLyrics,
        };

        setSongData(songWithLyrics);
        setTranslatedLyrics(
          song.translatedLyrics.length > 0
            ? song.translatedLyrics
            : ["", "", "", "", ""]
        );
        setOriginalLanguage(song.originalLanguage);
        setAcceptableAnswers(
          song.acceptableAnswers.length > 0
            ? song.acceptableAnswers
            : [song.songTitle]
        );
        setGameDate(song.gameDate);
      } else {
        // Step 2: Song doesn't exist in database, fetch from Spotify API
        setExistingSong(null);
        console.log("Song not found in database, fetching from Spotify API...");

        try {
          const spotifyResponse = await fetch(
            `/api/spotify-song?id=${spotifyId}`
          );
          const spotifyData = await spotifyResponse.json();

          if (spotifyData.success && spotifyData.track) {
            const track = spotifyData.track;

            // Step 3: Fetch lyrics from Genius API
            console.log("Fetching lyrics from Genius API...");
            let originalLyrics: string | undefined;
            let lyricsError: string | undefined;

            try {
              const artistName = track.artists
                .map((a: { name: string }) => a.name)
                .join(", ");
              const lyricsResponse = await fetch(
                `/api/genius-lyrics?title=${encodeURIComponent(
                  track.name
                )}&artist=${encodeURIComponent(artistName)}`
              );
              const lyricsData = await lyricsResponse.json();

              if (lyricsData.success && lyricsData.lyrics) {
                originalLyrics = lyricsData.lyrics;
              } else {
                lyricsError = "Lyrics not found for this song";
              }
            } catch (lyricsErr) {
              console.error("Failed to fetch lyrics:", lyricsErr);
              lyricsError = "Failed to fetch lyrics from Genius";
            }

            // Create SongWithLyrics object from Spotify data
            const songWithLyrics: SongWithLyrics = {
              id: track.id,
              name: track.name,
              artists: track.artists,
              album: track.album,
              duration_ms: track.duration_ms,
              external_urls: track.external_urls,
              popularity: track.popularity,
              originalLyrics,
              lyricsError,
            };

            setSongData(songWithLyrics);
            setTranslatedLyrics(["", "", "", "", ""]);
            setOriginalLanguage("en");
            setAcceptableAnswers([track.name || ""]);
            setGameDate("");
          } else {
            throw new Error("Failed to fetch song from Spotify");
          }
        } catch (apiError) {
          console.error("Failed to fetch from Spotify API:", apiError);
          // Final fallback: create basic structure
          setSongData({
            id: spotifyId,
            name: "",
            artists: [{ name: "" }],
            album: {
              name: "",
              images: [],
              release_date: new Date().getFullYear().toString(),
            },
            duration_ms: 0,
            external_urls: { spotify: "" },
            popularity: 0,
          });
          setTranslatedLyrics(["", "", "", "", ""]);
          setOriginalLanguage("en");
          setAcceptableAnswers([""]);
          setGameDate("");
        }
      }
    } catch (error) {
      console.error("Error loading song:", error);
      setError(error instanceof Error ? error.message : "Failed to load song");
    } finally {
      setLoading(false);
    }
  }, [spotifyId]);

  useEffect(() => {
    loadSongData();
  }, [loadSongData]);

  const saveGame = async () => {
    if (!songData || !spotifyId) return;

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

    if (!gameDate) {
      alert("Please select a game date");
      return;
    }

    const createSongData: CreateSongData = {
      songTitle: songData.name || existingSong?.songTitle || "",
      acceptableAnswers: filteredAnswers,
      artist:
        songData.artists.map((a) => a.name).join(", ") ||
        existingSong?.artist ||
        "",
      album: songData.album.name || existingSong?.album || "",
      releaseYear: songData.album.release_date
        ? new Date(songData.album.release_date).getFullYear()
        : existingSong?.releaseYear || new Date().getFullYear(),
      popularity: songData.popularity || existingSong?.popularity || 0,
      albumCover:
        songData.album.images[0]?.url || existingSong?.albumCover || "",
      originalLanguage,
      spotifyId: spotifyId,
      spotifyTrackId: spotifyId, // Use the Spotify ID directly as track ID
      translatedLyrics: filteredTranslated,
      originalLyrics: songData.originalLyrics,
      gameDate,
    };

    startTransition(async () => {
      try {
        const result = await createOrUpdateSong(createSongData);

        if (result.success) {
          triggerSuccess();
          // Reload data to get updated information
          loadSongData();
        } else {
          throw new Error(result.error || "Failed to save");
        }
      } catch (error) {
        console.error("Error saving song:", error);
        alert(
          `Failed to save: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-4">
          <Button
            onClick={() => router.push("/admin")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToAdmin")}
          </Button>
        </div>
        <ErrorState error={error} />
      </div>
    );
  }

  if (!songData) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-4">
          <Button
            onClick={() => router.push("/admin")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToAdmin")}
          </Button>
        </div>
        <ErrorState error="Song not found" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => router.push("/admin")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToAdmin")}
          </Button>
        </div>

        <SuccessMessage show={showSuccess} />

        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Show song info if we have meaningful data or existing song */}
          {(songData?.name || existingSong) && (
            <div className="w-full">
              <SelectedSongInfo song={songData} />
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            <div className="w-full">
              <DatePicker gameDate={gameDate} onDateChange={setGameDate} />
            </div>

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
                selectedSong={songData}
              />
            </div>

            <div className="w-full">
              <LyricsInput
                translatedLyrics={translatedLyrics}
                originalLyrics={songData.originalLyrics}
                lyricsError={songData.lyricsError}
                originalLanguage={originalLanguage}
                onUpdate={setTranslatedLyrics}
              />
            </div>

            <div className="w-full">
              <SaveGameButton onSave={saveGame} isPending={isPending} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SongEditPage() {
  return (
    <ProtectedPageLayout>
      <SongEditContent />
    </ProtectedPageLayout>
  );
}
