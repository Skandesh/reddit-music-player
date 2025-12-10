"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  MessageSquare,
} from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";
import { VideoPlayer } from "./VideoPlayer";

export function FloatingPlayer() {
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
    currentTrack,
    isCommentsOpen,
    toggleComments,
  } = usePlayerStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(containerRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.5,
    });
  }, []);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div
        ref={containerRef}
        className={cn(
          "relative flex items-center justify-between gap-4 p-3 rounded-[2rem]",
          "bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl",
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isExpanded ? "flex-col max-w-lg p-6 h-auto" : "h-20"
        )}
      >
        {/* Minimize Button */}
        {isExpanded && (
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 z-20 h-8 w-8 rounded-full"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                }}
            >
                <Minimize2 className="h-5 w-5" />
            </Button>
        )}
        {/* Album Art / Video Visualizer */}
        <div
            className={cn(
                "relative transition-all duration-500 overflow-hidden rounded-2xl shrink-0 cursor-pointer group",
                isExpanded ? "w-full aspect-video" : "w-14 h-14"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
        >
             <div className={cn("absolute inset-0 bg-cover bg-center transition-opacity", isExpanded ? "opacity-0" : "opacity-100")} style={{ backgroundImage: `url(${currentTrack.thumbnail})` }} />
             
             {/* Always mount VideoPlayer but hide via CSS/Layout when collapsed */}
             <div className={cn("absolute inset-0 bg-black", !isExpanded && "invisible")}>
                 <VideoPlayer className="w-full h-full" />
             </div>

             {/* Hover overlay for collapsed state */}
             {!isExpanded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-6 h-6 text-white" />
                </div>
             )}
        </div>

        {/* Track Info */}
        <div className={cn(
            "flex flex-col flex-1 min-w-0 transition-all duration-500",
             isExpanded ? "items-center text-center w-full" : "items-start"
        )}>
          <h3 className="font-semibold text-white text-sm sm:text-base truncate max-w-full">
            {currentTrack.title}
          </h3>
          <p className="text-xs text-white/50 truncate max-w-full">
            {currentTrack.author} • r/{currentTrack.subreddit}
          </p>
        </div>

        {/* Controls */}
        <div className={cn(
            "flex items-center gap-4 transition-all duration-500",
            isExpanded ? "w-full justify-center mt-4" : ""
        )}>
          <Button
            variant="ghost"
            size="icon"
            onClick={previous}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-10 w-10"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={toggle}
            className="h-12 w-12 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current text-black" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5 text-black" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-10 w-10"
          >
            <SkipForward className="h-5 w-5" />
          </Button>

           {/* Comments Toggle */}
           <Button
            variant="ghost"
            size="icon"
            onClick={toggleComments}
            className={cn(
                "text-white/70 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 transition-colors",
                isCommentsOpen && "bg-white/10 text-white"
            )}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Bar (Only visible when expanded or maybe sleek line at bottom when collapsed) */}
         {isExpanded && (
             <div className="w-full flex items-center gap-3 mt-2">
                <span className="text-xs text-white/50 tabular-nums">{formatTime(currentTime)}</span>
                <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    onValueChange={([value]) => seekTo(value)}
                    className="flex-1"
                />
                <span className="text-xs text-white/50 tabular-nums">{formatTime(duration)}</span>
             </div>
         )}
         
         {!isExpanded && (
             <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-white/10 overflow-hidden rounded-full">
                 <div 
                    className="h-full bg-white/50" 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                 />
             </div>
         )}
      </div>
    </div>
  );
}
