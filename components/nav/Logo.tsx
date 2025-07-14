import { cn } from "@/lib/utils";
import Link from "next/link";

type LogoProps = {
  href: string;
  className?: string;
  variant?: "default" | "icon-only";
};

export default function Logo({
  href = "/",
  className,
  variant = "default",
}: LogoProps) {
  const icon = variant === "icon-only" ? "🎵" : "🎵";

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 hover:opacity-80 transition-opacity",
        className
      )}
    >
      <div className="text-2xl">{icon}</div>
    </Link>
  );
}
