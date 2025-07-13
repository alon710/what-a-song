import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing text or target language" },
        { status: 400 }
      );
    }

    // For demo purposes, I'll use a simple mock translation
    // In production, you'd integrate with Google Translate API or similar
    const mockTranslations: { [key: string]: { [key: string]: string } } = {
      "The sun is shining bright": {
        he: "השמש זוהרת בבהירות",
      },
      "Love is in the air tonight": {
        he: "אהבה באוויר הלילה",
      },
      "Dancing through the night": {
        he: "רוקדים כל הלילה",
      },
      "השמש זוהרת בבהירות": {
        en: "The sun is shining bright",
      },
      "אהבה באוויר הלילה": {
        en: "Love is in the air tonight",
      },
      "רוקדים כל הלילה": {
        en: "Dancing through the night",
      },
    };

    const translatedText =
      mockTranslations[text]?.[targetLanguage] || `[Translation of: ${text}]`;

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
