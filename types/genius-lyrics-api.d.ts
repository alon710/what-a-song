declare module "genius-lyrics-api" {
  interface SearchOptions {
    title: string;
    artist: string;
    apiKey?: string;
    optimizeQuery?: boolean;
    authHeader?: boolean;
  }

  interface Song {
    id: number;
    title: string;
    url: string;
    lyrics: string;
    albumArt: string;
  }

  interface SearchResult {
    id: number;
    url: string;
    title: string;
    albumArt: string;
  }

  export function getLyrics(
    options: SearchOptions | string
  ): Promise<string | null>;
  export function getAlbumArt(options: SearchOptions): Promise<string | null>;
  export function getSong(options: SearchOptions): Promise<Song | null>;
  export function searchSong(
    options: SearchOptions
  ): Promise<SearchResult[] | null>;
  export function getSongById(
    id: number | string,
    accessToken: string
  ): Promise<Song | null>;
}
