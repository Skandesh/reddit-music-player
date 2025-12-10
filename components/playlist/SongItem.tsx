"use client";

import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, MessageSquare, ArrowUp, MoreHorizontal, ExternalLink, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlayerStore } from "@/stores/playerStore";
import type { QueueItem } from "@/types";

interface SongItemProps {
  track: QueueItem;
  index: number;
  isActive: boolean;
  onPlay: () => void;
}

export function SongItem({ track, index, isActive, onPlay }: SongItemProps) {
  const { isPlaying, removeFromQueue } = usePlayerStore();

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg transition-colors",
        "hover:bg-accent cursor-pointer",
        isActive && "bg-accent"
      )}
      onClick={onPlay}
    >
      {/* Index / Play button */}
      <div className="w-8 text-center shrink-0">
        {isActive && isPlaying ? (
          <Pause className="h-4 w-4 mx-auto text-primary" />
        ) : (
          <>
            <span className="group-hover:hidden text-sm text-muted-foreground">
              {index + 1}
            </span>
            <Play className="h-4 w-4 hidden group-hover:block mx-auto" />
          </>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium truncate", isActive && "text-primary")}>
          {track.title}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="truncate">u/{track.author}</span>
          <span className="hidden sm:inline">&bull;</span>
          <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
            r/{track.subreddit}
          </Badge>
        </div>
      </div>

      {/* Metadata */}
      <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground shrink-0">
        <div className="flex items-center gap-1">
          <ArrowUp className="h-3 w-3" />
          {formatNumber(track.score)}
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {formatNumber(track.commentCount)}
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a
              href={`https://reddit.com${track.permalink}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
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
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Source
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              removeFromQueue(index);
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove from Queue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
