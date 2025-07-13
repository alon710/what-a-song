"use client";

import { Music } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center space-y-4">
        <Music className="w-8 h-8 animate-spin mx-auto text-white" />
        <p className="text-lg text-white">Loading game...</p>
      </div>
    </div>
  );
}
