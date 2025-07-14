"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("admin");

  return (
    <Button
      onClick={onSave}
      disabled={isPending || disabled}
      className="w-full"
      size="lg"
    >
      {isPending ? (
        t("saving")
      ) : (
        <>
          <Save className="w-4 h-4 me-2" />
          {t("saveButton")}
        </>
      )}
    </Button>
  );
}
