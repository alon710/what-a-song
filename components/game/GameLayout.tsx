"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            🎮 Lyric Translation Game
          </h1>
          <Link href="/admin">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Admin Panel
            </Button>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
