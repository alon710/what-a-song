"use client";

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return <div className="w-full max-w-7xl mx-auto">{children}</div>;
}
