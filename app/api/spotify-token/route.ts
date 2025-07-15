import {
  SpotifyApiHelper,
  ApiSuccess,
  withErrorHandler,
} from "@/lib/api-utils";

async function handleSpotifyToken() {
  try {
    const accessToken = await SpotifyApiHelper.getAccessToken();
    return ApiSuccess.ok({ accessToken });
  } catch (error) {
    console.error("Failed to get Spotify access token:", error);
    throw new Error("Failed to authenticate with Spotify API");
  }
}

export const GET = withErrorHandler(handleSpotifyToken);
