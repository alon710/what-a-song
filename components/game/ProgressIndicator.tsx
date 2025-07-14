interface ProgressIndicatorProps {
  totalLines: number;
  revealedLines: number;
}

export default function ProgressIndicator({
  totalLines,
  revealedLines,
}: ProgressIndicatorProps) {
  return (
    <div className="flex justify-center space-x-2 mb-6">
      {Array.from({ length: totalLines }, (_, index) => (
        <div
          key={index}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors ${
            index < revealedLines
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-200 text-gray-500 border-gray-300"
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}
