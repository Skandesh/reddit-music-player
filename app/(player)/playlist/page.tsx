"use client";

import { ListMusic, Shuffle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/playerStore";
import { PlaylistView } from "@/components/playlist/PlaylistView";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { NowPlaying } from "@/components/player/NowPlaying";
import { CommentsPanel } from "@/components/comments/CommentsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PlaylistPage() {
  const { queue, currentTrack, shuffle, clearQueue } = usePlayerStore();

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ListMusic className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">Your queue is empty</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          Browse subreddits and click on tracks to add them to your queue, or
          visit a subreddit page to load its music.
        </p>
        <Button className="mt-6" asChild>
          <a href="/browse">Browse Subreddits</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Queue</h1>
          <p className="text-muted-foreground">
            {queue.length} {queue.length === 1 ? "track" : "tracks"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={shuffle}>
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearQueue}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* Video Player */}
          <div className="rounded-lg overflow-hidden bg-black aspect-video">
            <VideoPlayer />
          </div>

          {/* Now Playing Info */}
          {currentTrack && (
            <div className="p-4 rounded-lg border bg-card">
              <NowPlaying />
            </div>
          )}
        </div>

        {/* Sidebar with Queue and Comments */}
        <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-160px)]">
          <Tabs defaultValue="queue" className="h-full flex flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="queue" className="flex-1">
                Queue ({queue.length})
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex-1">
                Comments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="queue" className="flex-1 mt-4">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <PlaylistView />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="comments" className="flex-1 mt-4">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <CommentsPanel />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
