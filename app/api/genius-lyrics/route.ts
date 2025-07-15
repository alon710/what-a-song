import { NextRequest } from "next/server";
import { getLyrics, getSong } from "genius-lyrics-api";
import {
  GeniusApiHelper,
  ApiError,
  ApiSuccess,
  ParamUtils,
  validators,
  withErrorHandler,
} from "@/lib/api-utils";

async function handleGeniusLyrics(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = ParamUtils.getString(searchParams, "title", true);
  const artist = ParamUtils.getString(searchParams, "artist", true);

  if (!title || !validators.artistTitle(title)) {
    throw new Error("Title must be between 1 and 200 characters");
  }

  if (!artist || !validators.artistTitle(artist)) {
    throw new Error("Artist must be between 1 and 200 characters");
  }

  if (!GeniusApiHelper.validateCredentials()) {
    throw new Error("Genius API not properly configured");
  }

  try {
    const accessToken = GeniusApiHelper.getAccessToken();

    const options = {
      apiKey: accessToken || "",
      title: title.trim(),
      artist: artist.trim(),
      optimizeQuery: true,
    };

    let song;
    try {
      song = await getSong(options);
    } catch (songError) {
      console.warn(
        "Failed to get song metadata, falling back to lyrics only:",
        songError
      );
    }

    if (song && song.lyrics) {
      return ApiSuccess.ok({
        success: true,
        lyrics: song.lyrics,
        songInfo: {
          id: song.id,
          title: song.title,
          url: song.url,
          albumArt: song.albumArt,
        },
      });
    }

    const lyrics = await getLyrics(options);

    if (lyrics) {
      return ApiSuccess.ok({
        success: true,
        lyrics: lyrics,
        songInfo: null,
      });
    }

    return ApiError.notFound(
      "No lyrics found for this song. Try adjusting the title or artist name."
    );
  } catch (error: unknown) {
    console.error("Genius API Error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    const errorStatusCode =
      error && typeof error === "object" && "statusCode" in error
        ? (error as { statusCode: number }).statusCode
        : null;

    if (errorMessage.includes("404") || errorStatusCode === 404) {
      return ApiError.notFound(
        "Song not found on Genius. Try different search terms."
      );
    }

    if (errorMessage.includes("401") || errorStatusCode === 401) {
      throw new Error("Genius API authentication failed");
    }

    if (errorMessage.includes("429") || errorStatusCode === 429) {
      throw new Error(
        "Genius API rate limit exceeded. Please try again later."
      );
    }

    if (errorMessage.includes("timeout")) {
      throw new Error("Request timeout while fetching lyrics");
    }

    throw new Error("Failed to fetch lyrics from Genius");
  }
}

export const GET = withErrorHandler(handleGeniusLyrics);
