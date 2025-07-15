import { NextRequest, NextResponse } from "next/server";
import { getLyrics, getSong } from "genius-lyrics-api";

async function getGeniusAccessToken(): Promise<string | null> {
  const clientId = process.env.GENIUS_CLIENT_ID;
  const clientSecret = process.env.GENIUS_CLIENT_SECRET;
  const directAccessToken = process.env.GENIUS_ACCESS_TOKEN;

  // If we have direct access token, use it
  if (directAccessToken) {
    return directAccessToken;
  }

  // If we have client credentials, get access token via OAuth
  if (clientId && clientSecret) {
    try {
      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
        "base64"
      );

      const response = await fetch("https://api.genius.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.access_token;
      } else {
        console.error(
          "Failed to get Genius access token:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error getting Genius access token:", error);
    }
  }

  // Return null if no credentials available - library will attempt scraping
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "";
  const artist = searchParams.get("artist") || "";

  if (!title || !artist) {
    return NextResponse.json(
      { error: "Missing title or artist parameter" },
      { status: 400 }
    );
  }

  try {
    // Get access token using available credentials
    const accessToken = await getGeniusAccessToken();

    const options = {
      apiKey: accessToken || "", // If no token, the library will scrape
      title: title.trim(),
      artist: artist.trim(),
      optimizeQuery: true, // Clean up the query for better matching
    };

    // Try to get the full song info first (includes lyrics and other metadata)
    const song = await getSong(options);

    if (song && song.lyrics) {
      return NextResponse.json({
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

    // Fallback: try to get just lyrics
    const lyrics = await getLyrics(options);

    if (lyrics) {
      return NextResponse.json({
        success: true,
        lyrics: lyrics,
        songInfo: null,
      });
    }

    return NextResponse.json(
      { error: "No lyrics found for this song" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Genius API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lyrics from Genius" },
      { status: 500 }
    );
  }
}
