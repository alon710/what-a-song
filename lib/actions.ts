"use server";

import { db, ScoreData, SongData } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";

export interface CreateSongData {
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
  songId: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  songTitle: string;
  artist: string;
  album: string;
  releaseYear: number;
  isWon: boolean;
  triesUsed: number;
  hintsUsed: number;
  linesRevealed: number;
  timeElapsed: number;
  attempts: string[];
  usedHintTypes: string[];
}

export async function createSong(formData: FormData) {
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

    const songData: Omit<SongData, "id" | "createdAt" | "isActive"> = {
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

    const docRef = await addDoc(collection(db, "songs"), {
      ...songData,
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    console.log("Song created with ID:", docRef.id);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating song:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createSongWithRedirect(songData: CreateSongData) {
  try {
    if (
      !songData.songTitle ||
      !songData.artist ||
      !songData.acceptableAnswers.length ||
      !songData.translatedLyrics.length
    ) {
      throw new Error("Missing required fields");
    }

    const docRef = await addDoc(collection(db, "songs"), {
      ...songData,
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    console.log("Song created with ID:", docRef.id);
  } catch (error) {
    console.error("Error creating song:", error);
    throw error;
  }

  redirect("/admin?success=true");
}

export async function createSongOnly(songData: CreateSongData) {
  try {
    if (
      !songData.songTitle ||
      !songData.artist ||
      !songData.acceptableAnswers.length ||
      !songData.translatedLyrics.length
    ) {
      throw new Error("Missing required fields");
    }

    const docRef = await addDoc(collection(db, "songs"), {
      ...songData,
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    console.log("Song created with ID:", docRef.id);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating song:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getRandomSong() {
  try {
    const songsRef = collection(db, "songs");
    const q = query(songsRef, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "No songs available" };
    }

    const songs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SongData[];

    const randomIndex = Math.floor(Math.random() * songs.length);
    const selectedSong = songs[randomIndex];

    return { success: true, song: selectedSong };
  } catch (error) {
    console.error("Error fetching random song:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getAllSongs() {
  const collectionName = "songs";
  try {
    const songsRef = collection(db, collectionName);
    const querySnapshot = await getDocs(songsRef);

    const songs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SongData[];

    return { success: true, songs };
  } catch (error) {
    console.error("Error fetching songs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function saveScore(scoreData: SaveScoreData) {
  try {
    console.log("Starting to save score...", {
      songId: scoreData.songId,
      userId: scoreData.userId,
      songWon: scoreData.songWon,
    });

    // Validate required fields
    if (!scoreData.songId) {
      throw new Error("Missing songId");
    }
    if (!scoreData.songTitle) {
      throw new Error("Missing songTitle");
    }
    if (!scoreData.artist) {
      throw new Error("Missing artist");
    }

    const calculateScore = () => {
      let score = 0;

      if (scoreData.isWon) {
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
    console.log("Calculated score:", score);

    const scoreRecord: Omit<ScoreData, "id"> = {
      songId: scoreData.songId,
      userId: scoreData.userId || undefined,
      userEmail: scoreData.userEmail || undefined,
      userName: scoreData.userName || undefined,
      songTitle: scoreData.songTitle,
      artist: scoreData.artist,
      album: scoreData.album || "",
      releaseYear: scoreData.releaseYear || 0,
      isWon: scoreData.isWon,
      triesUsed: scoreData.triesUsed,
      hintsUsed: scoreData.hintsUsed,
      linesRevealed: scoreData.linesRevealed,
      timeElapsed: scoreData.timeElapsed,
      attempts: scoreData.attempts || [],
      usedHintTypes: scoreData.usedHintTypes || [],
      completedAt: new Date().toISOString(),
      score,
    };

    console.log("Attempting to save score record to Firestore...");

    const docRef = await addDoc(collection(db, "scores"), scoreRecord);
    console.log("Score saved successfully with ID:", docRef.id);

    return { success: true, id: docRef.id, score: scoreRecord };
  } catch (error) {
    console.error("Error saving score - Full error:", error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error instanceof Error ? error.stack : undefined,
    };
  }
}
