export type Language = "hebrew" | "english";

export type Lyrics = {
  [key in Language]: string[];
};
export type ArtistName = {
  [key in Language]: string[];
};

export type Song = {
  id: string;
  artistName: ArtistName;
  albumThumbnail: string;
  lyrics: Lyrics;
  songOriginLanguage: Language;
  youtubeLink: string;
  genre: string;
  releaseDate: Date;
};

// Spotify API response types
export type SpotifyImage = {
  url: string;
  height: number | null;
  width: number | null;
};

export type SpotifyExternalUrls = {
  spotify: string;
};

export type SpotifyArtist = {
  id: string;
  name: string;
  type: "artist";
  uri: string;
  external_urls: SpotifyExternalUrls;
  href: string;
};

export type SpotifyAlbum = {
  id: string;
  name: string;
  type: "album";
  uri: string;
  href: string;
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  external_urls: SpotifyExternalUrls;
  artists: SpotifyArtist[];
};

export type SpotifyTrack = {
  id: string;
  name: string;
  type: "track";
  uri: string;
  href: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  explicit: boolean;
  external_urls: SpotifyExternalUrls;
  preview_url: string | null;
  track_number: number;
  popularity: number;
};

export type SpotifySearchResponse = {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
  };
  albums?: {
    items: SpotifyAlbum[];
    total: number;
    limit: number;
    offset: number;
  };
  artists?: {
    items: SpotifyArtist[];
    total: number;
    limit: number;
    offset: number;
  };
};
