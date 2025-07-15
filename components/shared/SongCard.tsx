"use client";

import Image from "next/image";
import Link from "next/link";
import { SongData } from "@/lib/firebase";
import { Trophy, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface SongCardProps {
  song: SongData;
  userHasPlayed?: boolean;
  userHasWon?: boolean;
  showDate?: boolean;
}

export default function SongCard({
  song,
  userHasPlayed,
  userHasWon,
  showDate = false,
}: SongCardProps) {
  const t = useTranslations("songCard");

  return (
    <Link href={`/play/${song.id}`}>
      <div className="group relative aspect-square overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer">
        <Image
          src={song.albumCover}
          alt={`${song.songTitle} by ${song.artist}`}
          fill
          className={`object-cover transition-all duration-300 group-hover:scale-110 ${
            !userHasPlayed ? "blur-sm" : ""
          }`}
        />

        {/* Date label for history view */}
        {showDate && song.gameDate && (
          <div className="absolute top-2 left-2">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
              {format(new Date(song.gameDate), "MMM d, yyyy")}
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
              {song.songTitle}
            </h3>
            <p className="text-xs text-white/90 drop-shadow-md line-clamp-1">
              by {song.artist}
            </p>
            <p className="text-xs text-white/80 drop-shadow-md mt-1">
              {userHasWon ? t("completed") : t("attempted")}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
