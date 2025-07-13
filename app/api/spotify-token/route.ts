import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(req: NextRequest) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  try {
    const data = await spotifyApi.clientCredentialsGrant();
    return NextResponse.json({ accessToken: data.body.access_token });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get Spotify access token" },
      { status: 500 }
    );
  }
}
