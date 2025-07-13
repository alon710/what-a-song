"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { Hint } from "@/types";

interface HintsSectionProps {
  hints: Hint[];
  usedHints: string[];
  onUseHint: (hintId: string) => void;
  disabled: boolean;
}

export default function HintsSection({
  hints,
  usedHints,
  onUseHint,
  disabled,
}: HintsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Hints
          <Badge variant="outline">
            {usedHints.length}/{hints.length} used
          </Badge>
        </CardTitle>
        <CardDescription>
          Use hints strategically to help you guess the song!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {hints.map((hint) => {
            const isUsed = usedHints.includes(hint.id);
            const Icon = hint.icon;

            return (
              <div
                key={hint.id}
                className={`p-3 border rounded-lg ${
                  isUsed ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{hint.label}</span>
                  </div>
                  {!isUsed ? (
                    <Button
                      onClick={() => onUseHint(hint.id)}
                      size="sm"
                      variant="outline"
                      disabled={disabled}
                    >
                      Reveal
                    </Button>
                  ) : (
                    <span
                      className={`text-lg font-semibold ${
                        hint.id === "albumCover"
                          ? "text-green-700"
                          : "text-blue-700"
                      }`}
                    >
                      {hint.id === "albumCover"
                        ? "Album Revealed! 🎨"
                        : hint.value}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
