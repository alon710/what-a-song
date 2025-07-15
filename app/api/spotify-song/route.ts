import { NextRequest } from "next/server";
import {
  SpotifyApiHelper,
  ApiError,
  ApiSuccess,
  ParamUtils,
  validators,
  withErrorHandler,
} from "@/lib/api-utils";

async function handleSpotifyTrack(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const spotifyId = ParamUtils.getString(searchParams, "id", true);

  if (!spotifyId || !validators.spotifyId(spotifyId)) {
    throw new Error(
      "Invalid Spotify track ID format. Expected 22-character alphanumeric string."
    );
  }

  try {
    const spotifyApi = await SpotifyApiHelper.getAuthenticatedApi();
    const track = await spotifyApi.getTrack(spotifyId);

    if (!track.body) {
      return ApiError.notFound("Track not found");
    }

    return ApiSuccess.ok({
      success: true,
      track: track.body,
    });
  } catch (error: unknown) {
    console.error("Spotify API Error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    const errorStatusCode =
      error && typeof error === "object" && "statusCode" in error
        ? (error as { statusCode: number }).statusCode
        : null;

    if (errorMessage.includes("404") || errorStatusCode === 404) {
      return ApiError.notFound("Track not found");
    }

    if (errorMessage.includes("401") || errorStatusCode === 401) {
      throw new Error("Spotify authentication failed");
    }

    throw new Error("Failed to fetch track from Spotify");
  }
}

export const GET = withErrorHandler(handleSpotifyTrack);
