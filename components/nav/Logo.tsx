import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

type LogoProps = {
  href?: string;
  className?: string;
  variant?: "default" | "icon-only" | "with-text";
  size?: "sm" | "md" | "lg";
};

export default function Logo({
  href = "/",
  className,
  variant = "default",
  size = "md",
}: LogoProps) {
  const t = useTranslations();

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 hover:opacity-80 transition-opacity",
        className
      )}
    >
      <Image
        src="/logo192x192.png"
        alt={t("siteName")}
        width={size === "sm" ? 24 : size === "md" ? 32 : 48}
        height={size === "sm" ? 24 : size === "md" ? 32 : 48}
        className={cn("object-contain", sizeClasses[size])}
      />
      {variant === "with-text" && (
        <span className={cn("font-bold text-gray-900", textSizeClasses[size])}>
          {t("siteName")}
        </span>
      )}
    </Link>
  );
}
