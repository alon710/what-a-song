"use client";

import Image from "next/image";
import Link from "next/link";
import { SongData } from "@/lib/firebase";
import { Trophy } from "lucide-react";

interface SongCardProps {
  song: SongData;
  userHasPlayed?: boolean;
  userHasWon?: boolean;
}

export default function SongCard({
  song,
  userHasPlayed,
  userHasWon,
}: SongCardProps) {
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

        {/* Trophy for completed games */}
        {userHasPlayed && (
          <div className="absolute top-2 right-2">
            <div
              className={`p-2 rounded-full ${
                userHasWon ? "bg-yellow-500" : "bg-gray-500"
              } bg-opacity-90`}
            >
              <Trophy className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {/* Song details overlay for won games */}
        {userHasWon && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/30 backdrop-blur-sm p-4 m-2 rounded-lg">
            <h3 className="font-bold text-sm text-gray-800 line-clamp-1 mb-1">
              {song.songTitle}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-1">
              by {song.artist}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
