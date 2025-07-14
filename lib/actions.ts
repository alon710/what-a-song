"use server";

import { db, GameData } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";

export interface CreateGameData {
  songTitle: string;
  acceptableAnswers: string[];
  artist: string;
  album: string;
  releaseYear: number;
  popularity: number;
  albumCover: string;
  originalLanguage: "en" | "he";
  spotifyId: string;
  spotifyUrl: string;
  translatedLyrics: string[];
}

export async function createGame(formData: FormData) {
  try {
    // Extract data from FormData
    const songTitle = formData.get("songTitle") as string;
    const acceptableAnswersJson = formData.get("acceptableAnswers") as string;
    const artist = formData.get("artist") as string;
    const album = formData.get("album") as string;
    const releaseYear = parseInt(formData.get("releaseYear") as string);
    const popularity = parseInt(formData.get("popularity") as string);
    const albumCover = formData.get("albumCover") as string;
    const originalLanguage = formData.get("originalLanguage") as "en" | "he";
    const spotifyId = formData.get("spotifyId") as string;
    const spotifyUrl = formData.get("spotifyUrl") as string;
    const translatedLyricsJson = formData.get("translatedLyrics") as string;

    // Parse JSON fields
    const acceptableAnswers = JSON.parse(acceptableAnswersJson);
    const translatedLyrics = JSON.parse(translatedLyricsJson);

    // Validate required fields
    if (
      !songTitle ||
      !artist ||
      !acceptableAnswers.length ||
      !translatedLyrics.length
    ) {
      throw new Error("Missing required fields");
    }

    // Create game data object
    const gameData: Omit<GameData, "id" | "createdAt" | "isActive"> = {
      songTitle,
      acceptableAnswers,
      artist,
      album,
      releaseYear,
      popularity,
      albumCover,
      originalLanguage,
      spotifyId,
      spotifyUrl,
      translatedLyrics,
    };

    // Save to Firebase
    const docRef = await addDoc(collection(db, "games"), {
      ...gameData,
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    console.log("Game created with ID:", docRef.id);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating game:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createGameWithRedirect(gameData: CreateGameData) {
  try {
    // Validate required fields
    if (
      !gameData.songTitle ||
      !gameData.artist ||
      !gameData.acceptableAnswers.length ||
      !gameData.translatedLyrics.length
    ) {
      throw new Error("Missing required fields");
    }

    // Save to Firebase
    const docRef = await addDoc(collection(db, "games"), {
      ...gameData,
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    console.log("Game created with ID:", docRef.id);
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }

  // Redirect to admin panel with success message
  redirect("/admin?success=true");
}

export async function createGameOnly(gameData: CreateGameData) {
  try {
    // Validate required fields
    if (
      !gameData.songTitle ||
      !gameData.artist ||
      !gameData.acceptableAnswers.length ||
      !gameData.translatedLyrics.length
    ) {
      throw new Error("Missing required fields");
    }

    // Save to Firebase
    const docRef = await addDoc(collection(db, "games"), {
      ...gameData,
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    console.log("Game created with ID:", docRef.id);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating game:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getRandomGame() {
  try {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "No games available" };
    }

    const games = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GameData[];

    const randomIndex = Math.floor(Math.random() * games.length);
    const selectedGame = games[randomIndex];

    return { success: true, game: selectedGame };
  } catch (error) {
    console.error("Error fetching random game:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getAllGames() {
  try {
    const gamesRef = collection(db, "games");
    const querySnapshot = await getDocs(gamesRef);

    const games = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GameData[];

    return { success: true, games };
  } catch (error) {
    console.error("Error fetching games:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
