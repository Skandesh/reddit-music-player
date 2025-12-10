"use client";

import { SubredditCard } from "@/components/subreddit/SubredditCard";
import { usePlayerStore } from "@/stores/playerStore";
import { ListMusic } from "lucide-react";

export function PlaylistView() {
  const { queue, currentIndex, playTrack } = usePlayerStore();

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <ListMusic className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold">No tracks in queue</h3>
        <p className="text-sm text-muted-foreground">
          Browse subreddits to add music to your playlist
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {queue.map((track, index) => (
        <SubredditCard
          key={track.id}
          track={track}
          index={index}
          isActive={index === currentIndex}
          onPlay={() => playTrack(index)}
        />
      ))}
    </div>
  );
}
