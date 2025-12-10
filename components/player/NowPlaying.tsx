"use client";

import { ArrowUp, MessageSquare, ExternalLink, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { usePlayerStore } from "@/stores/playerStore";

export function NowPlaying() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center p-4">
        <p className="text-muted-foreground font-medium">No track playing</p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Select a subreddit to start listening
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight leading-tight line-clamp-2">
          {currentTrack.title}
        </h2>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">r/{currentTrack.subreddit}</span>
          <span className="text-muted-foreground/40">&bull;</span>
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>u/{currentTrack.author}</span>
          </div>
          <span className="text-muted-foreground/40">&bull;</span>
          <span>{formatRelativeTime(currentTrack.createdAt)}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ArrowUp className="h-4 w-4" />
          <span className="font-medium text-foreground">{formatNumber(currentTrack.score)}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium text-foreground">{formatNumber(currentTrack.commentCount)}</span>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
             <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground" asChild>
                <a
                    href={`https://reddit.com${currentTrack.permalink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Thread
                </a>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground" asChild>
                <a
                    href={currentTrack.video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Source
                </a>
            </Button>
        </div>
      </div>

      {currentTrack.selftext && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {currentTrack.selftext}
          </p>
        </div>
      )}
    </div>
  );
}
