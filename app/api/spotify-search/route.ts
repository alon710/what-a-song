import { NextRequest } from "next/server";
import {
  SpotifyApiHelper,
  ApiSuccess,
  ParamUtils,
  validators,
  withErrorHandler,
} from "@/lib/api-utils";

async function handleSpotifySearch(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = ParamUtils.getString(searchParams, "q", true);
  const limit = ParamUtils.getNumber(searchParams, "limit", 20);
  const offset = ParamUtils.getNumber(searchParams, "offset", 0);

  if (!query || !validators.searchQuery(query)) {
    throw new Error("Search query must be between 2 and 100 characters");
  }

  if (!validators.limit(limit)) {
    throw new Error("Limit must be a positive integer between 1 and 50");
  }

  if (!validators.offset(offset)) {
    throw new Error("Offset must be a non-negative integer");
  }

  try {
    const spotifyApi = await SpotifyApiHelper.getAuthenticatedApi();
    const results = await spotifyApi.searchTracks(query, { limit, offset });
    const tracks = results.body.tracks;

    return ApiSuccess.ok({
      tracks: tracks?.items || [],
      total: tracks?.total || 0,
      hasMore: tracks ? offset + limit < tracks.total : false,
      pagination: {
        limit,
        offset,
        next: tracks && offset + limit < tracks.total ? offset + limit : null,
        previous: offset > 0 ? Math.max(0, offset - limit) : null,
      },
    });
  } catch (error: unknown) {
    console.error("Spotify API Error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    const errorStatusCode =
      error && typeof error === "object" && "statusCode" in error
        ? (error as { statusCode: number }).statusCode
        : null;

    if (errorMessage.includes("400") || errorStatusCode === 400) {
      throw new Error("Invalid search query format");
    }

    if (errorMessage.includes("401") || errorStatusCode === 401) {
      throw new Error("Spotify authentication failed");
    }

    if (errorMessage.includes("429") || errorStatusCode === 429) {
      throw new Error(
        "Spotify API rate limit exceeded. Please try again later."
      );
    }

    throw new Error("Failed to search tracks on Spotify");
  }
}

export const GET = withErrorHandler(handleSpotifySearch);
