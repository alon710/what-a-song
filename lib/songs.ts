"use server";

import { db, SongData } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
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
  spotifyTrackId: string;
  translatedLyrics: string[];
  originalLyrics?: string;
  originalLyricsLines?: string[];
  gameDate: string;
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
    const spotifyTrackId = formData.get("spotifyTrackId") as string;
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

    const gameDate = formData.get("gameDate") as string;

    const songData: Omit<SongData, "id" | "createdAt" | "isActive"> = {
      songTitle,
      acceptableAnswers,
      artist,
      album,
      releaseYear,
      popularity,
      albumCover,
      originalLanguage,
      spotifyTrackId: spotifyTrackId,
      translatedLyrics,
      gameDate,
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
      !songData.translatedLyrics.length ||
      !songData.gameDate
    ) {
      throw new Error("Missing required fields");
    }

    const gameExists = await checkGameExistsForDate(songData.gameDate);
    if (gameExists) {
      throw new Error(
        `A game already exists for ${songData.gameDate}. Please choose a different date.`
      );
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
      !songData.translatedLyrics.length ||
      !songData.gameDate
    ) {
      throw new Error("Missing required fields");
    }

    const gameExists = await checkGameExistsForDate(songData.gameDate);
    if (gameExists) {
      throw new Error(
        `A game already exists for ${songData.gameDate}. Please choose a different date.`
      );
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

export async function createOrUpdateSong(songData: CreateSongData) {
  try {
    if (
      !songData.songTitle ||
      !songData.artist ||
      !songData.acceptableAnswers.length ||
      !songData.translatedLyrics.length ||
      !songData.gameDate ||
      !songData.spotifyId
    ) {
      throw new Error("Missing required fields");
    }

    const gameExists = await checkGameExistsForDate(songData.gameDate);
    const existingSong = await getSongById(songData.spotifyId);

    if (
      gameExists &&
      (!existingSong.success ||
        existingSong.song?.gameDate !== songData.gameDate)
    ) {
      throw new Error(
        `A game already exists for ${songData.gameDate}. Please choose a different date.`
      );
    }

    const isUpdate = existingSong.success;

    let originalLyricsLines: string[] | undefined;
    if (songData.originalLyrics) {
      const lines = songData.originalLyrics
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      originalLyricsLines = lines.slice(0, 5);
    }

    const dataToSave = {
      songTitle: songData.songTitle,
      acceptableAnswers: songData.acceptableAnswers,
      artist: songData.artist,
      album: songData.album,
      releaseYear: songData.releaseYear,
      popularity: songData.popularity,
      albumCover: songData.albumCover,
      originalLanguage: songData.originalLanguage,
      spotifyTrackId: songData.spotifyTrackId,
      translatedLyrics: songData.translatedLyrics,
      gameDate: songData.gameDate,
      id: songData.spotifyId,
      createdAt: isUpdate
        ? existingSong.song?.createdAt
        : new Date().toISOString(),
      isActive: true,
      ...(originalLyricsLines && { originalLyricsLines }),
    };

    await setDoc(doc(db, "songs", songData.spotifyId), dataToSave);

    console.log(
      `Song ${isUpdate ? "updated" : "created"} with Spotify ID:`,
      songData.spotifyId
    );

    return { success: true, id: songData.spotifyId };
  } catch (error) {
    console.error("Error creating/updating song:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getSongById(songId: string) {
  try {
    if (!songId) {
      return { success: false, error: "Missing songId" };
    }

    const songDoc = await getDoc(doc(db, "songs", songId));

    if (!songDoc.exists()) {
      return { success: false, error: "Song not found" };
    }

    const songData = {
      id: songDoc.id,
      ...songDoc.data(),
    } as SongData;

    if (!songData.isActive) {
      return { success: false, error: "Song is not active" };
    }

    return { success: true, song: songData };
  } catch (error) {
    console.error("Error fetching song by ID:", error);
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
  try {
    const songsRef = collection(db, "songs");
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

export async function getTodaysSong() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const songsRef = collection(db, "songs");
    const q = query(
      songsRef,
      where("gameDate", "==", today),
      where("isActive", "==", true)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "No game available for today" };
    }

    const song = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    } as SongData;

    return { success: true, song };
  } catch (error) {
    console.error("Error fetching today's song:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getActiveSongs() {
  try {
    const songsRef = collection(db, "songs");
    const q = query(songsRef, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    const songs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SongData[];

    return { success: true, songs };
  } catch (error) {
    console.error("Error fetching active songs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkGameExistsForDate(gameDate: string): Promise<boolean> {
  try {
    const songsRef = collection(db, "songs");
    const q = query(
      songsRef,
      where("gameDate", "==", gameDate),
      where("isActive", "==", true)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking game exists for date:", error);
    return false;
  }
}
