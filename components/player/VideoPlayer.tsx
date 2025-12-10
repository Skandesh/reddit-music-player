"use client";

import { useCallback, useEffect, useRef } from "react";
import YouTube, { YouTubePlayer, YouTubeEvent } from "react-youtube";
import { toast } from "sonner";
import { usePlayerStore } from "@/stores/playerStore";
import { cn } from "@/lib/utils";

// Extract YouTube video ID from URL
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
}

interface VideoPlayerProps {
  className?: string;
}

export function VideoPlayer({ className }: VideoPlayerProps = {}) {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    seekTime,
    setDuration,
    setCurrentTime,
    clearSeek,
    next,
  } = usePlayerStore();

  const playerRef = useRef<YouTubePlayer | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Control play/pause when isPlaying changes
  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // Control volume when volume/muted changes
  useEffect(() => {
    if (!playerRef.current) return;

    if (isMuted) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume, isMuted]);

  // Handle seeking
  useEffect(() => {
    if (seekTime !== null && playerRef.current) {
      playerRef.current.seekTo(seekTime, true);
      clearSeek();
    }
  }, [seekTime, clearSeek]);

  // Reset time when track changes
  useEffect(() => {
    if (currentTrack) {
      setCurrentTime(0);
    }
  }, [currentTrack?.id, setCurrentTime]);

  // Cleanup progress interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleReady = useCallback(
    (event: YouTubeEvent) => {
      playerRef.current = event.target;

      // Set initial volume
      if (isMuted) {
        event.target.mute();
      } else {
        event.target.unMute();
        event.target.setVolume(volume * 100);
      }

      // Get duration
      const duration = event.target.getDuration();
      if (duration) {
        setDuration(duration);
      }

      // Start progress tracking
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          setCurrentTime(currentTime);
        }
      }, 1000);

      // Auto-play if isPlaying is true
      if (isPlaying) {
        event.target.playVideo();
      }
    },
    [setDuration, setCurrentTime, volume, isMuted, isPlaying]
  );

  const handleEnd = useCallback(() => {
    next();
  }, [next]);

  const handleError = useCallback(
    (event: YouTubeEvent) => {
      const errorMessages: Record<number, string> = {
        2: "Invalid video ID",
        5: "Video cannot be played in embedded player",
        100: "Video not found or removed",
        101: "Video cannot be embedded",
        150: "Video cannot be embedded",
      };
      const message = errorMessages[event.data] || "Video playback error";
      toast.error("Skipping track", {
        description: message,
      });
      next();
    },
    [next]
  );

  if (!currentTrack) {
    return (
      <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Select a track to play</p>
      </div>
    );
  }

  const videoId = getYouTubeId(currentTrack.video.url);

  if (!videoId) {
    return (
      <div className={cn("aspect-video bg-muted flex items-center justify-center rounded-lg", className)}>
        <p className="text-muted-foreground">Invalid video URL</p>
      </div>
    );
  }

  return (
    <div className={cn("aspect-video bg-black rounded-lg overflow-hidden", className)}>
      <YouTube
        videoId={videoId}
        title={`Now playing: ${currentTrack.title}`}
        className="w-full h-full"
        iframeClassName="w-full h-full"
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
            controls: 1,
          },
        }}
        onReady={handleReady}
        onEnd={handleEnd}
        onError={handleError}
      />
    </div>
  );
}
