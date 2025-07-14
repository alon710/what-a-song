"use server";

import { db, ScoreData } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export interface SaveScoreData {
  songId: string;
  userId?: string;
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

export async function saveScore(scoreData: SaveScoreData) {
  try {
    console.log("Starting to save score...", {
      songId: scoreData.songId,
      userId: scoreData.userId,
      isWon: scoreData.isWon,
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
      userId: scoreData.userId || "",
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

export async function getUserScoreForSong(userId: string, songId: string) {
  try {
    if (!userId || !songId) {
      return { success: false, error: "Missing userId or songId" };
    }

    const scoresRef = collection(db, "scores");
    const q = query(
      scoresRef,
      where("userId", "==", userId),
      where("songId", "==", songId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: true, hasPlayed: false, hasWon: false, score: null };
    }

    // Get the user's score (there should only be one per user per song)
    const scores = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ScoreData[];

    const userScore = scores[0]; // Take the first (and should be only) score

    return {
      success: true,
      hasPlayed: true,
      hasWon: userScore.isWon,
      score: userScore,
    };
  } catch (error) {
    console.error("Error checking user score for song:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      hasPlayed: false,
      hasWon: false,
      score: null,
    };
  }
}

export async function getUserScores(userId: string) {
  try {
    if (!userId) {
      return { success: false, error: "Missing userId" };
    }

    const scoresRef = collection(db, "scores");
    const q = query(scoresRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const scores = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ScoreData[];

    return { success: true, scores };
  } catch (error) {
    console.error("Error fetching user scores:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      scores: [],
    };
  }
}
