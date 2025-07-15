"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface NavbarButtonProps {
  icon: LucideIcon;
  text?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

export default function NavbarButton({
  icon: Icon,
  text,
  href,
  onClick,
  disabled,
  children,
  className = "",
}: NavbarButtonProps) {
  const buttonContent = (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-1 text-gray-700 h-8 touch-manipulation ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
      {text && (
        <span className="hidden sm:inline text-xs sm:text-sm">{text}</span>
      )}
      {children}
    </Button>
  );

  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
}
