# Lokal — Music Player App

A fully-featured music streaming app built with React Native (Expo) using the JioSaavn API. Supports search, album browsing, a full-screen player, mini player, queue management, and background playback.

---

## Features

- **Home Screen** — Horizontally scrollable album sections by category (Trending, Bollywood, Tamil, Telugu, Punjabi, etc.)
- **Search** — Real-time song search with album navigation
- **Album Details** — Full song list with "More Like This" suggestions powered by artist-based search
- **Full Player** — Album art, seek bar, play/pause, next/previous, repeat modes, queue access
- **Mini Player** — Persistent floating player synced with the full player, hides on the player screen
- **Queue** — Add, remove, and navigate songs; persisted across sessions with AsyncStorage
- **Background Playback** — Audio continues when the app is minimized or the screen is off
- **Song Options Sheet** — Bottom sheet menu (Play, Play Next, Add to Queue) on every song row


---

## Tech Stack

| Category | Library |
|---|---|
| Framework | React Native (Expo SDK 53) |
| Language | TypeScript |
| Navigation | React Navigation v6 (Native Stack + Bottom Tabs) |
| State Management | Zustand |
| Storage | AsyncStorage |
| Audio | expo-audio |
| UI | NativeWind (Tailwind CSS) |
| Bottom Sheet | @gorhom/bottom-sheet |
| Slider | @react-native-community/slider |
| Blur | expo-blur |
| Gradient | expo-linear-gradient |

---

## Project Structure

```
├── App.tsx                        # Root component, NavigationContainer
├── index.ts                       # Entry point, registerRootComponent
├── global.css                     # Tailwind base styles
├── navigation/
│   └── TabNavigator.tsx           # Bottom tab navigator (Home, Search)
├── screens/
│   ├── Home.tsx                   # Home screen with album sections
│   ├── Search.tsx                 # Search screen
│   ├── AlbumDetails.tsx           # Album details + songs + suggestions
│   ├── Player.tsx                 # Full screen player
│   ├── Queue.tsx                  # Queue management screen
│   ├── AudioProvider.tsx          # Mounts expo-audio globally
│   └── NavigationTracker.tsx      # Tracks active screen in Zustand
├── components/
│   ├── MiniPlayer.tsx             # Floating mini player
│   └── SongOptionsSheet.tsx       # Bottom sheet song menu
├── store/
│   └── playerStore.ts             # Zustand store (player + queue state)
└── hooks/
    └── usePlayer.ts               # togglePlay, seekTo, playNext, playPrevious
```

---

## API

All data is sourced from the unofficial JioSaavn API:

**Base URL:** `https://saavn.sumit.co`

| Endpoint | Usage |
|---|---|
| `GET /api/search/songs?query=` | Song search |
| `GET /api/search/albums?query=` | Album search / home sections / suggestions |
| `GET /api/albums?id=` | Album details and song list |

No API key required.

---

## Setup

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Xcode (for iOS builds)
- Android Studio (for Android builds)

### Installation

```bash
git clone https://github.com/jainayagam/music-player-lokal.git
cd music-player-lokal
npm install
```

### Running in Development

```bash
npx expo start --clear
```

> Note: Background audio was not implemented as it requires a native build and couldnt be implemented in expo go

### Native Build (required for background audio)

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

---

## Architecture

### State Management

All player and queue state lives in a single Zustand store (`playerStore.ts`). Components read from the store directly — no prop drilling.

```
setCurrentSong() → AudioProvider detects change → player.replace(url) → player.play()
                                                 → status synced back to store
```

### Audio

`expo-audio` hooks must live inside React components, so audio logic is split:

- **`AudioProvider`** — Mounts `useAudioPlayer` once at the top level, loads new songs when `currentSong` changes, syncs playback status back to the store
- **`usePlayer`** — Exposes `togglePlay`, `seekTo`, `playNext`, `playPrevious` to any component via a global player reference

### Navigation

```
NavigationContainer
└── Stack.Navigator
    ├── Tabs (TabNavigator)
    │   ├── Home
    │   └── Search
    ├── AlbumDetails
    ├── Player
    └── Queue
```

`MiniPlayer` and `AudioProvider` are rendered outside the navigator so they persist across all screens.

### Queue Persistence

The queue array and current index are saved to AsyncStorage on every mutation and reloaded on app start via `loadQueue()`.

---

## Trade-offs

- **expo-audio over expo-av** — `expo-av` is deprecated as of SDK 53. `expo-audio` requires hooks to live in components, so a global player reference pattern is implemented instead of storing the player instance in Zustand directly.
- **AsyncStorage over MMKV** — AsyncStorage was used for simplicity
- **navigation.replace on suggestions** — Album suggestion navigation uses `replace` instead of `push` to prevent deep stack buildup when browsing multiple suggestions.


---

## Features Implemented


- Song options bottom sheet (Play, Play Next, Add to Queue) on all song lists
- "More Like This" album suggestions on Album Details page
- Mini player hides on full player screen
- Mini player becomes invisible (opacity 0) when bottom sheet is open

---


---

## APK

https://expo.dev/accounts/jainayagam/projects/Lokal-selection/builds/61f362a3-d925-4b8e-9ceb-534593e1fb64
