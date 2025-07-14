"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NavTitle() {
  const t = useTranslations("home");

  return (
    <Link
      href="/"
      className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
    >
      {t("title")}
    </Link>
  );
}
