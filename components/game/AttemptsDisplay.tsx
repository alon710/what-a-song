"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

interface AttemptsDisplayProps {
  attempts: string[];
  triesLeft: number;
}

export default function AttemptsDisplay({
  attempts,
  triesLeft,
}: AttemptsDisplayProps) {
  if (attempts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Previous Attempts
        </CardTitle>
        <CardDescription>
          Your previous guesses ({5 - triesLeft} of 5 used)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {attempts.map((attempt, index) => (
            <Badge key={index} variant="outline" className="text-sm">
              {attempt}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
