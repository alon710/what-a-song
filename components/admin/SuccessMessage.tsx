"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";

interface SuccessMessageProps {
  show: boolean;
}

export default function SuccessMessage({ show }: SuccessMessageProps) {
  const t = useTranslations("admin");

  if (!show) return null;

  return (
    <Card className="mb-8 border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-green-800">
          <Save className="w-5 h-5" />
          <span className="font-medium">{t("successMessage")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
