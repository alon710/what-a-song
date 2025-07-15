import { NextRequest, NextResponse } from "next/server";
import { getLyrics, getSong } from "genius-lyrics-api";

async function getGeniusAccessToken(): Promise<string | null> {
  const directAccessToken = process.env.GENIUS_ACCESS_TOKEN;

  // Return the direct access token if available
  if (directAccessToken) {
    return directAccessToken;
  }

  // Return null if no access token available - library will attempt scraping
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
