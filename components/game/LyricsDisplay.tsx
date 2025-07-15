interface LyricsDisplayProps {
  lyrics: string[];
  revealedLines: number;
}

export default function LyricsDisplay({
  lyrics,
  revealedLines,
}: LyricsDisplayProps) {
  return (
    <div className="space-y-3 mb-6">
      {lyrics.map((lyric, index) => (
        <div
          key={index}
          className={`text-center py-1 transition-all duration-500 ${
            index < revealedLines
              ? "text-gray-800 font-medium"
              : "text-gray-400 filter blur-sm select-none"
          }`}
        >
          {lyric}
        </div>
      ))}
    </div>
  );
}
