"use client";

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return <div className="max-w-7xl mx-auto">{children}</div>;
}
