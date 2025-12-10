import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SUBREDDITS } from "@/config/subreddits";
import type { SubredditInfo, SortMethod, TimePeriod } from "@/types";

interface SubredditState {
  selected: string[];
  available: SubredditInfo[];
  sortMethod: SortMethod;
  timePeriod: TimePeriod;

  addSubreddit: (name: string) => void;
  removeSubreddit: (name: string) => void;
  setSelected: (subreddits: string[]) => void;
  setSortMethod: (sort: SortMethod) => void;
  setTimePeriod: (period: TimePeriod) => void;
}

export const useSubredditStore = create<SubredditState>()(
  persist(
    (set) => ({
      selected: ["listentothis"],
      available: DEFAULT_SUBREDDITS,
      sortMethod: "hot",
      timePeriod: "week",

      addSubreddit: (name) =>
        set((state) => ({
          selected: state.selected.includes(name)
            ? state.selected
            : [...state.selected, name],
        })),

      removeSubreddit: (name) =>
        set((state) => ({
          selected: state.selected.filter((s) => s !== name),
        })),

      setSelected: (subreddits) => set({ selected: subreddits }),

      setSortMethod: (sort) => set({ sortMethod: sort }),

      setTimePeriod: (period) => set({ timePeriod: period }),
    }),
    {
      name: "subreddit-storage",
      partialize: (state) => ({
        selected: state.selected,
        sortMethod: state.sortMethod,
        timePeriod: state.timePeriod,
      }),
    }
  )
);
