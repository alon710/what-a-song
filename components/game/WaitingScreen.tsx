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
    <div className="text-center space-y-8 py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{tGame("title")}</h1>
        <p className="text-gray-600">{tGame("waitingToStart")}</p>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
        <div className="relative aspect-square m-4 rounded-xl overflow-hidden">
          <Image
            src={songData.albumCover}
            alt="Album cover"
            fill
            className="object-cover filter blur-xl"
          />
        </div>

        <div className="p-8">
          <div className="space-y-2 mb-6">
            {songData.translatedLyrics.slice(0, 3).map((_, index) => (
              <div
                key={index}
                className="text-center py-2 text-gray-400 filter blur-sm select-none"
              >
                ████████ ████ ████████
              </div>
            ))}
          </div>

          <button
            onClick={onStartGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            {tGame("startGame")}
          </button>
        </div>
      </div>
    </div>
  );
}
