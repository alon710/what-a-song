# 🎵 What a Song - Lyric Translation Game

A Next.js application that creates engaging lyric translation guessing games with AI-powered translation suggestions.

## Features

- **🎮 Interactive Game**: Players guess song titles based on translated lyrics
- **🎯 Progressive Hints**: Artist name, popularity, album, and release year
- **📊 Performance Tracking**: Statistics on hints used, lines revealed, and time taken
- **🤖 AI Translation**: Gemini AI-powered automatic translation suggestions for admins
- **🔍 Spotify Integration**: Search and select songs with rich metadata
- **🔥 Firebase Backend**: Secure game data storage and retrieval
- **🌐 Multi-language Support**: Hebrew ↔ English translation support
- **🎨 Modern UI**: Beautiful responsive design with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 15+, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Firebase Firestore
- **AI**: Google Gemini AI for translations
- **Music Data**: Spotify Web API
- **Deployment**: Vercel-ready

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Google Gemini AI API (for translation suggestions)
GEMINI_API_KEY=your_gemini_api_key_here
```

## API Keys Setup

### 1. Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Get your Client ID and Client Secret

### 2. Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Firestore Database
4. Get your web app configuration

### 3. Google Gemini AI

1. Go to [Google AI Studio](https://ai.google.dev)
2. Get your API key for Gemini

## Getting Started

1. **Clone and install dependencies:**

```bash
git clone <repository-url>
cd what-a-song
npm install
```

2. **Set up environment variables:**
   Copy `.env.local` with your API keys (see above)

3. **Run the development server:**

```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Usage

### For Game Creators (Admin Panel)

1. Navigate to `/admin`
2. Search for songs using Spotify
3. Select a song (AI automatically analyzes metadata to predict lyrics language)
4. Enter original lyrics (AI detects actual language as you type)
5. Use AI translation suggestions or enter manual translations
6. Save the game

### For Players

1. Navigate to `/game`
2. Try to guess the song title from translated lyrics
3. Use hints strategically to improve your score
4. View your performance summary

## AI Translation Features

The admin panel includes intelligent translation suggestions powered by Google Gemini AI:

### Smart Language Detection

- **Metadata Analysis**: Instantly predicts lyrics language from song title, artist names, and album info
- **Lyrics Detection**: Real-time analysis of actual lyrics as you type
- **Auto-Configuration**: Automatically sets original language based on confident predictions

### Translation Capabilities

- **Individual Line Translation**: Translate single lyric lines with context
- **Batch Translation**: Translate all lyrics at once
- **Context-Aware**: Uses song and artist information for better translations
- **Smart Prompting**: Maintains poetic meaning and natural flow
- **Hebrew ↔ English**: Specialized support for both languages

## Project Structure

```
app/
├── admin/              # Admin panel for creating games
├── game/               # Game interface for players
├── api/
│   ├── spotify-*       # Spotify API integration
│   ├── translate-gemini # Gemini AI translation
│   └── admin/games/    # Game CRUD operations
├── components/ui/      # shadcn/ui components
└── lib/
    └── firebase.ts     # Firebase configuration
```

## Copyright Notice

⚠️ **Important**: This application is designed for educational and personal use. When using copyrighted lyrics:

- Ensure you have proper rights and permissions
- Use short excerpts that qualify as fair use
- Consider using public domain or Creative Commons licensed content
- The application includes prominent copyright warnings

## License

This project is for educational purposes. Please respect copyright laws and obtain proper licensing for any commercial use.
