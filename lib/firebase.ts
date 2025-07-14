import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export interface GameData {
  id: string;
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
  createdAt: string;
  isActive: boolean;
}

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "user";
  createdAt: string;
  lastLogin: string;
}

export interface ScoreData {
  id: string;
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
  completedAt: string;
  score: number;
}
