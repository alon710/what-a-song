import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
    const q = query(collection(db, "games"), where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "No games available" },
        { status: 404 }
      );
    }

    const games: any[] = [];
    querySnapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
    });

    const randomGame = games[Math.floor(Math.random() * games.length)];

    return NextResponse.json({ game: randomGame });
  } catch (error) {
    console.error("Error fetching random game:", error);
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}
