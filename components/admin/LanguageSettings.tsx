"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LanguageSettingsProps {
  originalLanguage: "en" | "he";
  onLanguageChange: (language: "en" | "he") => void;
}

export default function LanguageSettings({
  originalLanguage,
  onLanguageChange,
}: LanguageSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Original Language</Label>
        <div className="flex gap-2 mt-2">
          <Button
            variant={originalLanguage === "en" ? "default" : "outline"}
            onClick={() => onLanguageChange("en")}
          >
            English
          </Button>
          <Button
            variant={originalLanguage === "he" ? "default" : "outline"}
            onClick={() => onLanguageChange("he")}
          >
            Hebrew
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
