"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

interface GuessInputProps {
  guess: string;
  onGuessChange: (guess: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  triesLeft: number;
}

export default function GuessInput({
  guess,
  onGuessChange,
  onSubmit,
  disabled,
  triesLeft,
}: GuessInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      onSubmit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Guess</CardTitle>
        <CardDescription>
          What song do you think this is? Enter the song title below.
          {triesLeft > 0 && (
            <span
              className={`block mt-1 ${
                triesLeft <= 2
                  ? "text-red-600 font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {triesLeft} {triesLeft === 1 ? "try" : "tries"} remaining
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter the song title..."
          value={guess}
          onChange={(e) => onGuessChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        <Button
          onClick={onSubmit}
          disabled={disabled || !guess.trim()}
          className="w-full"
        >
          Submit Guess
        </Button>
      </CardContent>
    </Card>
  );
}
