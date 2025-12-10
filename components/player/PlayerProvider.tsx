"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { usePlayerStore } from "@/stores/playerStore";

function KeyboardShortcuts() {
  const { toggle, next, previous, setVolume, volume, toggleMute, shuffle } =
    usePlayerStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          toggle();
          break;
        case "ArrowRight":
          if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
            next();
          }
          break;
        case "ArrowLeft":
          if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
            previous();
          }
          break;
        case "ArrowUp":
          if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
            setVolume(Math.min(1, volume + 0.1));
          }
          break;
        case "ArrowDown":
          if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
            setVolume(Math.max(0, volume - 0.1));
          }
          break;
        case "KeyM":
          toggleMute();
          break;
        case "KeyS":
          if (e.shiftKey) {
            e.preventDefault();
            shuffle();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, next, previous, setVolume, volume, toggleMute, shuffle]);

  return null;
}

function PageTitleUpdater() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  useEffect(() => {
    if (currentTrack) {
      document.title = `${currentTrack.title} - Reddit Music Player`;
    } else {
      document.title = "Reddit Music Player";
    }
  }, [currentTrack]);

  return null;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardShortcuts />
      <PageTitleUpdater />
      {children}
    </QueryClientProvider>
  );
}
