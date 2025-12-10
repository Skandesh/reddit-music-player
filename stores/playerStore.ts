import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QueueItem } from "@/types";

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  isCommentsOpen: boolean;
  queue: QueueItem[];
  currentIndex: number;
  currentTrack: QueueItem | null;
  seekTime: number | null; // When set, triggers a seek in the player

  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (time: number) => void;
  clearSeek: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleComments: () => void;
  setQueue: (items: QueueItem[]) => void;
  addToQueue: (item: QueueItem) => void;
  removeFromQueue: (index: number) => void;
  playTrack: (index: number) => void;
  shuffle: () => void;
  clearQueue: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      isRepeat: false,
      isCommentsOpen: false,
      queue: [],
      currentIndex: -1,
      currentTrack: null,
      seekTime: null,

      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),

      next: () => {
        const { queue, currentIndex, isRepeat } = get();
        if (queue.length === 0) return;

        let nextIndex: number;
        if (isRepeat) {
          nextIndex = currentIndex;
        } else {
          nextIndex = (currentIndex + 1) % queue.length;
        }

        set({
          currentIndex: nextIndex,
          currentTrack: queue[nextIndex],
          isPlaying: true,
          currentTime: 0,
        });
      },

      previous: () => {
        const { queue, currentIndex, currentTime } = get();
        if (queue.length === 0) return;

        // If more than 3 seconds in, restart current track
        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }

        const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
        set({
          currentIndex: prevIndex,
          currentTrack: queue[prevIndex],
          isPlaying: true,
          currentTime: 0,
        });
      },

      seekTo: (time) => set({ seekTime: time, currentTime: time }),
      clearSeek: () => set({ seekTime: null }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),

      setVolume: (volume) => set({ volume, isMuted: false }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      toggleRepeat: () => set((state) => ({ isRepeat: !state.isRepeat })),
      toggleComments: () => set((state) => ({ isCommentsOpen: !state.isCommentsOpen })),

      setQueue: (items) =>
        set({
          queue: items,
          currentIndex: items.length > 0 ? 0 : -1,
          currentTrack: items[0] || null,
        }),

      addToQueue: (item) =>
        set((state) => ({
          queue: [...state.queue, item],
          currentIndex: state.currentIndex === -1 ? 0 : state.currentIndex,
          currentTrack: state.currentTrack || item,
        })),

      removeFromQueue: (index) =>
        set((state) => {
          const newQueue = state.queue.filter((_, i) => i !== index);
          let newIndex = state.currentIndex;
          let newTrack = state.currentTrack;

          if (index < state.currentIndex) {
            newIndex = state.currentIndex - 1;
          } else if (index === state.currentIndex) {
            newIndex = Math.min(index, newQueue.length - 1);
            newTrack = newQueue[newIndex] || null;
          }

          return {
            queue: newQueue,
            currentIndex: newIndex,
            currentTrack: newTrack,
          };
        }),

      playTrack: (index) =>
        set((state) => ({
          currentIndex: index,
          currentTrack: state.queue[index],
          isPlaying: true,
          currentTime: 0,
        })),

      shuffle: () =>
        set((state) => {
          if (state.queue.length <= 1) return state;

          const currentTrack = state.currentTrack;
          const otherTracks = state.queue.filter((_, i) => i !== state.currentIndex);

          // Fisher-Yates shuffle
          for (let i = otherTracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otherTracks[i], otherTracks[j]] = [otherTracks[j], otherTracks[i]];
          }

          const shuffled = currentTrack
            ? [currentTrack, ...otherTracks]
            : otherTracks;

          return {
            queue: shuffled,
            currentIndex: 0,
            currentTrack: shuffled[0],
          };
        }),

      clearQueue: () =>
        set({
          queue: [],
          currentIndex: -1,
          currentTrack: null,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
        }),
    }),
    {
      name: "player-storage",
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        isRepeat: state.isRepeat,
        isCommentsOpen: state.isCommentsOpen,
      }),
    }
  )
);
