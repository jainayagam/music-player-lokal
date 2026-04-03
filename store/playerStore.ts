import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Song {
  id: string;
  name: string;
  artists: string;
  image: string;
  url: string;
  duration: number;
}

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  activeScreen: string;
  queue: Song[];
  currentIndex: number;

  setCurrentSong: (song: Song) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setActiveScreen: (screen: string) => void;

  addToQueue: (song: Song) => Promise<void>;
  removeFromQueue: (index: number) => Promise<void>;
  reorderQueue: (from: number, to: number) => Promise<void>;
  playNext: () => void;
  playPrevious: () => void;
  clearQueue: () => Promise<void>;
  loadQueue: () => Promise<void>;
  playSongFromQueue: (index: number) => void;
  isSheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;

}

const QUEUE_KEY = "player_queue";
const QUEUE_INDEX_KEY = "player_queue_index";

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  activeScreen: "",
  queue: [],
  currentIndex: 0,

  setCurrentSong: (song) => {
    const { queue } = get();
    const existingIndex = queue.findIndex((s) => s.id === song.id);

    if (existingIndex !== -1) {
      // Song already in queue, just update index
      set({ currentSong: song, currentIndex: existingIndex });
      AsyncStorage.setItem(QUEUE_INDEX_KEY, String(existingIndex));
    } else {
      // Add to queue and play
      const newQueue = [...queue, song];
      const newIndex = newQueue.length - 1;
      set({ currentSong: song, queue: newQueue, currentIndex: newIndex });
      AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
      AsyncStorage.setItem(QUEUE_INDEX_KEY, String(newIndex));
    }
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  setActiveScreen: (screen) => set({ activeScreen: screen }),

  addToQueue: async (song) => {
    const { queue } = get();
    const alreadyExists = queue.some((s) => s.id === song.id);
    if (alreadyExists) return;
    const newQueue = [...queue, song];
    set({ queue: newQueue });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
  },

  removeFromQueue: async (index) => {
    const { queue, currentIndex } = get();
    const newQueue = queue.filter((_, i) => i !== index);
    const newIndex = index < currentIndex
      ? currentIndex - 1
      : Math.min(currentIndex, newQueue.length - 1);
    set({ queue: newQueue, currentIndex: newIndex });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
    await AsyncStorage.setItem(QUEUE_INDEX_KEY, String(newIndex));
  },

  reorderQueue: async (from, to) => {
    const { queue, currentIndex } = get();
    const newQueue = [...queue];
    const [moved] = newQueue.splice(from, 1);
    newQueue.splice(to, 0, moved);

    // Update currentIndex if current song was moved
    let newIndex = currentIndex;
    if (from === currentIndex) {
      newIndex = to;
    } else if (from < currentIndex && to >= currentIndex) {
      newIndex = currentIndex - 1;
    } else if (from > currentIndex && to <= currentIndex) {
      newIndex = currentIndex + 1;
    }

    set({ queue: newQueue, currentIndex: newIndex });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
    await AsyncStorage.setItem(QUEUE_INDEX_KEY, String(newIndex));
  },

  playNext: () => {
    const { queue, currentIndex } = get();
    if (currentIndex < queue.length - 1) {
      const newIndex = currentIndex + 1;
      set({ currentSong: queue[newIndex], currentIndex: newIndex });
      AsyncStorage.setItem(QUEUE_INDEX_KEY, String(newIndex));
    }
  },

  playPrevious: () => {
    const { queue, currentIndex } = get();
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      set({ currentSong: queue[newIndex], currentIndex: newIndex });
      AsyncStorage.setItem(QUEUE_INDEX_KEY, String(newIndex));
    }
  },

  clearQueue: async () => {
    set({ queue: [], currentIndex: 0 });
    await AsyncStorage.removeItem(QUEUE_KEY);
    await AsyncStorage.removeItem(QUEUE_INDEX_KEY);
  },

  loadQueue: async () => {
    try {
      const queueData = await AsyncStorage.getItem(QUEUE_KEY);
      const indexData = await AsyncStorage.getItem(QUEUE_INDEX_KEY);
      if (queueData) {
        const queue = JSON.parse(queueData);
        const currentIndex = indexData ? parseInt(indexData) : 0;
        const currentSong = queue[currentIndex] ?? null;
        set({ queue, currentIndex, currentSong });
      }
    } catch (e) {
      console.error("Failed to load queue:", e);
    }
  },

  playSongFromQueue: (index) => {
    const { queue } = get();
    if (queue[index]) {
      set({ currentSong: queue[index], currentIndex: index });
      AsyncStorage.setItem(QUEUE_INDEX_KEY, String(index));
    }
  },
   isSheetOpen: false,
   setSheetOpen: (open) => set({ isSheetOpen: open }),
}));