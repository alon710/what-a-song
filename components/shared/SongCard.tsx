"use client";

import Image from "next/image";
import Link from "next/link";
import { SongData } from "@/lib/firebase";
import { SpotifyTrack } from "@/types";
import { Trophy, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface BaseSongCardData {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  gameDate?: string;
}

interface SongCardProps {
  song: SongData | SpotifyTrack | BaseSongCardData;
  userHasPlayed?: boolean;
  userHasWon?: boolean;
  showDate?: boolean;
  onClick?: () => void;
  href?: string;
}

// Helper function to normalize song data to common format
function normalizeSongData(
  song: SongData | SpotifyTrack | BaseSongCardData
): BaseSongCardData {
  // If it's already normalized
  if ("title" in song && "artist" in song && "albumCover" in song) {
    return song as BaseSongCardData;
  }

  // If it's SongData (Firebase format)
  if ("songTitle" in song) {
    const songData = song as SongData;
    return {
      id: songData.id,
      title: songData.songTitle,
      artist: songData.artist,
      albumCover: songData.albumCover,
      gameDate: songData.gameDate,
    };
  }

  // If it's SpotifyTrack
  const spotifyTrack = song as SpotifyTrack;
  return {
    id: spotifyTrack.id,
    title: spotifyTrack.name,
    artist: spotifyTrack.artists.map((a) => a.name).join(", "),
    albumCover: spotifyTrack.album.images[0]?.url || "",
    gameDate: undefined,
  };
}

export default function SongCard({
  song,
  userHasPlayed,
  userHasWon,
  showDate = false,
  onClick,
  href,
}: SongCardProps) {
  const t = useTranslations("songCard");
  const normalizedSong = normalizeSongData(song);

  const cardContent = (
    <div className="group relative aspect-square overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer">
      <Image
        src={normalizedSong.albumCover}
        alt={`${normalizedSong.title} by ${normalizedSong.artist}`}
        fill
        className={`object-cover transition-all duration-300 group-hover:scale-110 ${
          !userHasPlayed && !onClick ? "blur-sm" : ""
        }`}
      />

      {/* Date label for history view */}
      {showDate && normalizedSong.gameDate && (
        <div className="absolute top-2 left-2">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
            {format(new Date(normalizedSong.gameDate), "MMM d, yyyy")}
          </div>
        </div>
      )}

      {/* Trophy/Status icon for completed games */}
      {userHasPlayed && (
        <div className="absolute top-2 right-2">
          <div
            className={`p-2 rounded-full ${
              userHasWon ? "bg-yellow-500" : "bg-red-500"
            } bg-opacity-90`}
          >
            {userHasWon ? (
              <Trophy className="w-5 h-5 text-white" />
            ) : (
              <XCircle className="w-5 h-5 text-white" />
            )}
          </div>
        </div>
      )}

      {/* Song details overlay for completed games */}
      {userHasPlayed && (
        <div
          className={`absolute bottom-0 left-0 right-0 ${
            userHasWon ? "bg-green-600/70" : "bg-red-600/70"
          } backdrop-blur-md p-4 m-2 rounded-lg border ${
            userHasWon ? "border-green-400/50" : "border-red-400/50"
          }`}
        >
          <h3 className="font-bold text-sm text-white drop-shadow-lg line-clamp-1 mb-1">
            {normalizedSong.title}
          </h3>
          <p className="text-xs text-white/90 drop-shadow-md line-clamp-1">
            by {normalizedSong.artist}
          </p>
          <p className="text-xs text-white/80 drop-shadow-md mt-1">
            {userHasWon ? t("completed") : t("attempted")}
          </p>
        </div>
      )}

      {/* Simple overlay for admin/search view */}
      {!userHasPlayed && onClick && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md p-3 m-2 rounded-lg">
          <h3 className="font-bold text-sm text-white drop-shadow-lg line-clamp-1 mb-1">
            {normalizedSong.title}
          </h3>
          <p className="text-xs text-white/90 drop-shadow-md line-clamp-1">
            by {normalizedSong.artist}
          </p>
        </div>
      )}
    </div>
  );

  // If href is provided, wrap in Link
  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  // If onClick is provided, wrap in div with onClick
  if (onClick) {
    return <div onClick={onClick}>{cardContent}</div>;
  }

  // Default behavior for backward compatibility
  return <Link href={`/play/${normalizedSong.id}`}>{cardContent}</Link>;
}
