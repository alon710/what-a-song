export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
    release_date: string;
  };
  duration_ms: number;
  external_urls: { spotify: string };
  popularity: number;
  explicit?: boolean;
  preview_url?: string | null;
}

export interface GameStats {
  hintsUsed: number;
  linesRevealed: number;
  timeElapsed: number;
  gameWon: boolean;
  triesUsed: number;
  attempts: string[];
}

export interface Hint {
  id: string;
  label: string;
  icon: any; // Lucide icon component
  value: string;
}
