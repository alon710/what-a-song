"use server";

import { db, GameData, ScoreData } from "./firebase";
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

export interface SaveScoreData {
  gameId: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  songTitle: string;
  artist: string;
  album: string;
  releaseYear: number;
  gameWon: boolean;
  triesUsed: number;
  hintsUsed: number;
  linesRevealed: number;
  timeElapsed: number;
  attempts: string[];
  usedHintTypes: string[];
}

export async function createGame(formData: FormData) {
  try {
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

    const acceptableAnswers = JSON.parse(acceptableAnswersJson);
    const translatedLyrics = JSON.parse(translatedLyricsJson);

    if (
      !songTitle ||
      !artist ||
      !acceptableAnswers.length ||
      !translatedLyrics.length
    ) {
      throw new Error("Missing required fields");
    }

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
    if (
      !gameData.songTitle ||
      !gameData.artist ||
      !gameData.acceptableAnswers.length ||
      !gameData.translatedLyrics.length
    ) {
      throw new Error("Missing required fields");
    }

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

  redirect("/admin?success=true");
}

export async function createGameOnly(gameData: CreateGameData) {
  try {
    if (
      !gameData.songTitle ||
      !gameData.artist ||
      !gameData.acceptableAnswers.length ||
      !gameData.translatedLyrics.length
    ) {
      throw new Error("Missing required fields");
    }

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

export async function saveScore(scoreData: SaveScoreData) {
  try {
    const calculateScore = () => {
      let score = 0;

      if (scoreData.gameWon) {
        score += 1000;

        const triesBonus = (3 - scoreData.triesUsed) * 200;
        score += triesBonus;

        const hintsBonus = (5 - scoreData.hintsUsed) * 100;
        score += hintsBonus;

        const linesBonus = Math.max(0, (5 - scoreData.linesRevealed) * 50);
        score += linesBonus;

        if (scoreData.timeElapsed <= 30) score += 300;
        else if (scoreData.timeElapsed <= 60) score += 200;
        else if (scoreData.timeElapsed <= 120) score += 100;
      }

      return Math.max(0, score);
    };

    const score = calculateScore();

    const scoreRecord: Omit<ScoreData, "id"> = {
      gameId: scoreData.gameId,
      userId: scoreData.userId,
      userEmail: scoreData.userEmail,
      userName: scoreData.userName,
      songTitle: scoreData.songTitle,
      artist: scoreData.artist,
      album: scoreData.album,
      releaseYear: scoreData.releaseYear,
      gameWon: scoreData.gameWon,
      triesUsed: scoreData.triesUsed,
      hintsUsed: scoreData.hintsUsed,
      linesRevealed: scoreData.linesRevealed,
      timeElapsed: scoreData.timeElapsed,
      attempts: scoreData.attempts,
      usedHintTypes: scoreData.usedHintTypes,
      completedAt: new Date().toISOString(),
      score,
    };

    const docRef = await addDoc(collection(db, "scores"), scoreRecord);
    console.log("Score saved with ID:", docRef.id);

    return { success: true, id: docRef.id, score };
  } catch (error) {
    console.error("Error saving score:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
