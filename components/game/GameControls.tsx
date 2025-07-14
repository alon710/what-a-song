import { useTranslations } from "next-intl";

interface GameControlsProps {
  currentGuess: string;
  onGuessChange: (value: string) => void;
  onSubmitGuess: () => void;
  disabled?: boolean;
}

export default function GameControls({
  currentGuess,
  onGuessChange,
  onSubmitGuess,
  disabled = false,
}: GameControlsProps) {
  const tGame = useTranslations("game");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      onSubmitGuess();
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={currentGuess}
        onChange={(e) => onGuessChange(e.target.value)}
        placeholder={tGame("guessInput.placeholder")}
        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      <button
        onClick={onSubmitGuess}
        disabled={!currentGuess.trim() || disabled}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-colors"
      >
        {tGame("guessInput.submitGuess")}
      </button>
    </div>
  );
}
