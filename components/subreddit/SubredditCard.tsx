"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  MessageSquare,
  ArrowUp,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlayerStore } from "@/stores/playerStore";
import type { QueueItem } from "@/types";

interface SubredditCardProps {
  track: QueueItem;
  index: number;
  isActive: boolean;
  onPlay: () => void;
}

export function SubredditCard({
  track,
  index,
  isActive,
  onPlay,
}: SubredditCardProps) {
  const { isPlaying, removeFromQueue } = usePlayerStore();
  const cardRef = useRef<HTMLDivElement>(null);

  // GSAP Entry Animation
  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        delay: index * 0.05, // Stagger effect
        ease: "power2.out",
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative flex items-center gap-4 p-4 mb-3 rounded-2xl transition-all duration-300",
        "border border-white/10 shadow-lg backdrop-blur-md",
        "hover:scale-[1.02] hover:shadow-xl hover:border-white/20",
        isActive
          ? "bg-white/10 border-primary/50 shadow-primary/10"
          : "bg-white/5 hover:bg-white/10"
      )}
      onClick={onPlay}
    >
      {/* Glass Reflection Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Index / Play Button */}
      <div className="relative z-10 w-10 h-10 flex items-center justify-center shrink-0">
        <div
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300",
            isActive ? "bg-primary text-primary-foreground" : "bg-white/10 group-hover:bg-primary group-hover:text-primary-foreground"
          )}
        >
          {isActive && isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <>
              <span
                className={cn(
                  "font-medium text-sm transition-all duration-300",
                  "group-hover:hidden",
                  isActive && "hidden"
                )}
              >
                {index + 1}
              </span>
              <Play
                className={cn(
                  "h-4 w-4 fill-current ml-0.5 transition-all duration-300",
                  "hidden group-hover:block",
                  isActive && "block"
                )}
              />
            </>
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="relative z-10 flex-1 min-w-0">
        <h3
          className={cn(
            "font-semibold text-base truncate pr-2 transition-colors",
            isActive ? "text-primary" : "text-foreground"
          )}
        >
          {track.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground/80">
          <div className="flex items-center gap-1 hover:text-foreground transition-colors">
            <User className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{track.author}</span>
          </div>
          <span className="text-muted-foreground/40">&bull;</span>
          <Badge
            variant="outline"
            className="text-[10px] h-5 px-1.5 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
          >
            r/{track.subreddit}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 hidden sm:flex items-center gap-4 text-xs text-muted-foreground/80 shrink-0">
        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full border border-white/5">
          <ArrowUp className="h-3 w-3" />
          <span>{formatNumber(track.score)}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full border border-white/5">
          <MessageSquare className="h-3 w-3" />
          <span>{formatNumber(track.commentCount)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-black/90 backdrop-blur-xl border-white/10 animate-in fade-in zoom-in-95 duration-200"
          >
            <DropdownMenuItem asChild>
              <a
                href={`https://reddit.com${track.permalink}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer focus:bg-white/10"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                View on Reddit
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={track.video.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer focus:bg-white/10"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Source
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                removeFromQueue(index);
              }}
              className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove from Queue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
