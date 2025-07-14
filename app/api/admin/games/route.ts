import { NextRequest, NextResponse } from "next/server";
import { db, SongData } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const collectionName = "songs";
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";

    let q;
    if (activeOnly) {
      q = query(collection(db, collectionName), where("isActive", "==", true));
    } else {
      q = query(collection(db, collectionName));
    }

    const querySnapshot = await getDocs(q);
    const songs: SongData[] = [];

    querySnapshot.forEach((doc) => {
      songs.push({ id: doc.id, ...doc.data() } as SongData);
    });

    return NextResponse.json({ songs });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const collectionName = "songs";
  try {
    const gameData = await req.json();

    const newGame: Omit<SongData, "id"> = {
      ...gameData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const docRef = await addDoc(collection(db, collectionName), newGame);

    return NextResponse.json({
      id: docRef.id,
      message: "Song created successfully",
    });
  } catch (error) {
    console.error("Error creating song:", error);
    return NextResponse.json(
      { error: "Failed to create song" },
      { status: 500 }
    );
  }
}
