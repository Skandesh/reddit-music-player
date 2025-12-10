// src/components/player/PlayerControls. tsx
'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { formatTime } from '@/lib/utils';

export function PlayerControls() {
  const {
    isPlaying,
    toggle,
    next,
    previous,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = usePlayerStore();

  return (
    <div className="flex items-center gap-6 w-full">
      {/* Playback Controls */}
      <div className="flex items-center gap-3">
        <Button
            variant="ghost"
            size="icon"
            onClick={previous}
            aria-label="Previous track"
            className="text-muted-foreground hover:text-foreground h-8 w-8"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="icon"
          className="h-10 w-10 rounded-full shadow-sm hover:scale-105 transition-transform"
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 fill-current ml-0.5" />
          )}
        </Button>

        <Button
            variant="ghost"
            size="icon"
            onClick={next}
            aria-label="Next track"
            className="text-muted-foreground hover:text-foreground h-8 w-8"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-1 items-center gap-3">
        <span className="text-xs font-medium tabular-nums text-muted-foreground w-10 text-right">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={([value]) => seekTo(value)}
          aria-label="Seek position"
          className="flex-1 cursor-pointer"
        />
        <span className="text-xs font-medium tabular-nums text-muted-foreground w-10">
          {formatTime(duration)}
        </span>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-32 justify-end">
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="text-muted-foreground hover:text-foreground h-8 w-8"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          max={100}
          step={1}
          onValueChange={([value]) => setVolume(value / 100)}
          aria-label="Volume"
          className="w-20"
        />
      </div>
    </div>
  );
}
