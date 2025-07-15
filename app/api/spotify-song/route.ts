import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spotifyId = searchParams.get("id");

  if (!spotifyId) {
    return NextResponse.json(
      { error: "Missing Spotify track ID" },
      { status: 400 }
    );
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);

    const track = await spotifyApi.getTrack(spotifyId);

    if (!track.body) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      track: track.body,
    });
  } catch (error) {
    console.error("Spotify API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch track from Spotify" },
      { status: 500 }
    );
  }
}
