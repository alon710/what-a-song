"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NavTitle() {
  const t = useTranslations("home");

  return (
    <Link
      href="/"
      className="text-xl font-bold text-white hover:opacity-80 transition-opacity"
    >
      {t("title")}
    </Link>
  );
}
