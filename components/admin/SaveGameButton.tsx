"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveGameButtonProps {
  onSave: () => void;
  isPending: boolean;
  disabled?: boolean;
}

export default function SaveGameButton({
  onSave,
  isPending,
  disabled,
}: SaveGameButtonProps) {
  return (
    <Button
      onClick={onSave}
      disabled={isPending || disabled}
      className="w-full"
      size="lg"
    >
      {isPending ? (
        "Saving..."
      ) : (
        <>
          <Save className="w-4 h-4 me-2" />
          Save Game
        </>
      )}
    </Button>
  );
}
