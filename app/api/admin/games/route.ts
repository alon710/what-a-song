import { NextRequest, NextResponse } from "next/server";
import { db, GameData } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Get all games or filter by active status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";

    let q;
    if (activeOnly) {
      q = query(collection(db, "games"), where("isActive", "==", true));
    } else {
      q = query(collection(db, "games"));
    }

    const querySnapshot = await getDocs(q);
    const games: GameData[] = [];

    querySnapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() } as GameData);
    });

    return NextResponse.json({ games });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

// Create a new game
export async function POST(req: NextRequest) {
  try {
    const gameData = await req.json();

    const newGame: Omit<GameData, "id"> = {
      ...gameData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const docRef = await addDoc(collection(db, "games"), newGame);

    return NextResponse.json({
      id: docRef.id,
      message: "Game created successfully",
    });
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
