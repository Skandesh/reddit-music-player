// src/hooks/useKeyboardShortcuts.ts
'use client';

import { useEffect } from 'react';
import { usePlayerStore } from '@/stores/playerStore';

export function useKeyboardShortcuts() {
  const { toggle, next, previous, setVolume, volume } = usePlayerStore();

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
        case 'Space':
          e.preventDefault();
          toggle();
          break;
        case 'ArrowRight':
          if (e.shiftKey) next();
          break;
        case 'ArrowLeft':
          if (e.shiftKey) previous();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyM':
          usePlayerStore.getState().toggleMute();
          break;
        case 'KeyS':
          if (e.shiftKey) usePlayerStore.getState().shuffle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle, next, previous, setVolume, volume]);
}
