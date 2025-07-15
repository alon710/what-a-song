import { useTranslations } from "next-intl";
import Image from "next/image";
import { SongData } from "@/lib/firebase";

interface WaitingScreenProps {
  songData: SongData;
  onStartGame: () => void;
}

export default function WaitingScreen({
  songData,
  onStartGame,
}: WaitingScreenProps) {
  const tGame = useTranslations("game");

  return (
    <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 py-4 sm:py-8 md:py-16">
      <div className="space-y-2 sm:space-y-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          {tGame("title")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {tGame("waitingToStart")}
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
        <div className="relative aspect-square m-2 sm:m-3 md:m-4 rounded-lg sm:rounded-xl overflow-hidden">
          <Image
            src={songData.albumCover}
            alt="Album cover"
            fill
            className="object-cover filter blur-xl"
          />
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
            {songData.translatedLyrics.slice(0, 3).map((_, index) => (
              <div
                key={index}
                className="text-center py-1 sm:py-2 text-gray-400 filter blur-sm select-none text-sm sm:text-base"
              >
                ████████ ████ ████████
              </div>
            ))}
          </div>

          <button
            onClick={onStartGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
          >
            {tGame("startGame")}
          </button>
        </div>
      </div>
    </div>
  );
}
