# 🎵 What a Song - Lyric Translation Game

A Next.js application that creates engaging lyric translation guessing games.

## Features

- **🎮 Interactive Game**: Players guess song titles based on translated lyrics with 5 attempts
- **🎯 Enhanced Hints System**: 5 strategic hints including blurred album cover reveal
- **⏱️ Real-time Timer**: Automatic timer with performance tracking
- **📊 Performance Tracking**: Statistics on hints used, lines revealed, tries used, and time taken
- **✅ Multiple Valid Answers**: Support for different ways to write song titles
- **🔍 Spotify Integration**: Search and select songs with rich metadata
- **🔥 Firebase Backend**: Secure game data storage and retrieval
- **🌐 Full Internationalization (i18n)**: Complete Hebrew and English interface with RTL support
- **🔄 Language Switching**: Dynamic language switching with URL routing
- **📱 RTL Layout**: Proper right-to-left layout support for Hebrew users
- **🎨 Modern UI**: Beautiful responsive design with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 15+, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions, Firebase Firestore
- **Music Data**: Spotify Web API
- **Internationalization**: next-intl with Hebrew (default) and English
- **Deployment**: Vercel-ready

## Internationalization (i18n)

The application supports full internationalization with:

- **Hebrew (עברית)**: Default language with RTL layout support
- **English**: Alternative language with LTR layout
- **Dynamic Switching**: Language switcher in the UI
- **URL Routing**:
  - Hebrew (default): `/`, `/play`, `/admin`
  - English: `/en`, `/en/play`, `/en/admin`
- **RTL Support**: Complete right-to-left layout for Hebrew interface
- **Translated Content**: All UI text, messages, and feedback in both languages

### Language Files

- `messages/he.json`: Hebrew translations
- `messages/en.json`: English translations
- Configuration: `i18n.ts` and `middleware.ts`

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
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
3. Select a song and set the original language
4. Add multiple acceptable answers (different ways to write the song title)
5. Enter translated lyrics (up to 5 lines)
6. Save the game

### For Players

1. Navigate to `/game`
2. Try to guess the song title from translated lyrics
3. Use hints strategically to improve your score
4. View your performance summary

## Multiple Valid Answers Feature

The admin panel allows you to add multiple acceptable answers for each song to improve the player experience:

### Examples of Multiple Answers:

- **"Can't Help Myself"** and **"Can't Help Myself (Sugar Pie Honey Bunch)"**
- **"Yesterday"** and **"Yesterday (Remastered)"**
- **"Bohemian Rhapsody"** and **"Bohemian Rhapsody - 2011 Mix"**
- **"Don't Stop Me Now"** and **"Don't Stop Me Now - 2011 Mix"**

### Why This Matters:

- **User-Friendly**: Players don't need to guess the exact Spotify title format
- **Flexible**: Accounts for common abbreviations and variations
- **Better Experience**: Reduces frustration from "technically correct" answers being rejected

### Best Practices:

- Always include the basic song title without extra information
- Add versions without parentheses if the original has them
- Include common shortened versions or nicknames
- Consider alternate spellings or punctuation variations

## Server Actions

The application uses Next.js 15+ Server Actions for modern, efficient form handling:

### Key Features:

- **Type-Safe**: Full TypeScript support with shared interfaces
- **Progressive Enhancement**: Works without JavaScript
- **Better Performance**: No client-side fetch calls needed
- **Automatic Revalidation**: Built-in cache invalidation
- **Error Handling**: Server-side validation and error management

### Available Actions:

- `createGame(formData)` - Create new game from form data
- `createGameWithRedirect(gameData)` - Create game and redirect on success
- `getRandomGame()` - Fetch random active game for playing
- `getAllGames()` - Admin function to list all games

### Benefits over API Routes:

- **Less Boilerplate**: No need for separate API endpoints
- **Better DX**: Direct function calls instead of fetch
- **Type Safety**: Shared types between client and server
- **Built-in Loading States**: useTransition() for pending states

## Project Structure

```
app/
├── admin/              # Admin panel for creating games
├── game/               # Game interface for players
├── api/
│   ├── spotify-*       # Spotify API integration
│   └── translate/      # Translation utilities
├── components/
│   ├── admin/          # Admin panel components
│   │   ├── SearchSongs.tsx      # Song search functionality
│   │   ├── AcceptableAnswers.tsx # Multiple answers management
│   │   ├── LanguageSettings.tsx # Language selection
│   │   ├── LyricsInput.tsx      # Lyrics input form
│   │   ├── SelectedSongInfo.tsx # Song details display
│   │   ├── SuccessMessage.tsx   # Success feedback
│   │   └── SaveGameButton.tsx   # Save game action
│   ├── game/           # Game interface components
│   │   ├── GameHeader.tsx       # Progress and navigation
│   │   ├── LyricsDisplay.tsx    # Lyrics presentation
│   │   ├── GuessInput.tsx       # Guess submission
│   │   ├── HintsSection.tsx     # Hints management
│   │   └── ResultsDialog.tsx    # Game results modal
│   └── ui/             # shadcn/ui base components
├── lib/
│   ├── actions.ts      # Next.js Server Actions
│   └── firebase.ts     # Firebase configuration
├── types/
│   └── index.ts        # Shared TypeScript interfaces
```

## Copyright Notice

⚠️ **Important**: This application is designed for educational and personal use. When using copyrighted lyrics:

- Ensure you have proper rights and permissions
- Use short excerpts that qualify as fair use
- Consider using public domain or Creative Commons licensed content
- Always respect copyright laws

## License

This project is for educational purposes. Please respect copyright laws and obtain proper licensing for any commercial use.
