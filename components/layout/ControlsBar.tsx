"use client";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";
import { usePlayerStore } from "@/stores/playerStore";

export function ControlsBar() {
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
    isRepeat,
    toggleRepeat,
    shuffle,
    currentTrack,
    queue,
  } = usePlayerStore();

  if (!currentTrack && queue.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex flex-col">
        {/* Progress bar - full width at top */}
        <div className="w-full px-2 pt-1">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={([value]) => seekTo(value)}
            className="w-full h-1 cursor-pointer"
          />
        </div>

        <div className="flex items-center h-16 px-4 gap-4">
          {/* Track Info - Left */}
          <div className="flex items-center gap-3 w-1/4 min-w-0">
            {currentTrack ? (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {currentTrack.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    r/{currentTrack.subreddit} &bull; u/{currentTrack.author}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No track selected</p>
            )}
          </div>

          {/* Playback Controls - Center */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isRepeat && "text-primary"
                )}
                onClick={toggleRepeat}
              >
                <Repeat className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={previous}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={toggle}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={next}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={shuffle}
                disabled={queue.length <= 1}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-10 text-right">{formatTime(currentTime)}</span>
              <span>/</span>
              <span className="w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume & Actions - Right */}
          <div className="flex items-center gap-2 w-1/4 justify-end">
            {currentTrack && (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a
                    href={`https://reddit.com${currentTrack.permalink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a
                    href={currentTrack.video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </>
            )}
            <div className="hidden sm:flex items-center gap-2 w-28">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
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
                className="w-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
