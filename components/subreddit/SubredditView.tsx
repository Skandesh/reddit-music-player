"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Music, Loader2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/playerStore";
import { SortSelector } from "./SortSelector";
import { PlaylistView } from "@/components/playlist/PlaylistView";
import { CommentsPanel } from "@/components/comments/CommentsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSubredditPosts, filterMusicPosts } from "@/lib/reddit";
import { buildQueue } from "@/lib/youtube";
import type { QueueItem, SortMethod, TimePeriod } from "@/types";

interface SubredditViewProps {
  subreddit: string;
  initialQueue: QueueItem[];
  initialSort: SortMethod;
  initialTime: TimePeriod;
}

export function SubredditView({
  subreddit,
  initialQueue,
  initialSort,
  initialTime,
}: SubredditViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { queue, setQueue, currentTrack } = usePlayerStore();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(initialQueue.length === 0);
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null);

  // Set queue when subreddit changes, or fetch client-side if server-side failed
  useEffect(() => {
    if (initialQueue.length > 0) {
      setQueue(initialQueue);
      setIsInitialLoading(false);
    } else {
      // Server-side fetch failed, try client-side
      const fetchClientSide = async () => {
        setIsInitialLoading(true);
        setInitialLoadError(null);
        try {
          const currentSort = (searchParams.get("sort") as SortMethod) || initialSort;
          const currentTime = (searchParams.get("t") as TimePeriod) || initialTime;

          const { posts } = await getSubredditPosts(subreddit, currentSort, 50, currentTime);
          const musicPosts = filterMusicPosts(posts);
          const tracks = buildQueue(musicPosts);

          if (tracks.length > 0) {
            setQueue(tracks);
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to load tracks";
          setInitialLoadError(message);
        } finally {
          setIsInitialLoading(false);
        }
      };
      fetchClientSide();
    }
  }, [subreddit, initialQueue, setQueue, searchParams, initialSort, initialTime]);

  const handleSortChange = useCallback(
    (sort: SortMethod, time?: TimePeriod) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", sort);
      if (time && sort === "top") {
        params.set("t", time);
      } else {
        params.delete("t");
      }
      router.push(`/r/${subreddit}?${params.toString()}`);
    },
    [router, subreddit, searchParams]
  );

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    setLoadMoreError(null);
    try {
      const currentSort = (searchParams.get("sort") as SortMethod) || initialSort;
      const currentTime = (searchParams.get("t") as TimePeriod) || initialTime;

      const { posts } = await getSubredditPosts(
        subreddit,
        currentSort,
        50,
        currentTime
      );
      const musicPosts = filterMusicPosts(posts);
      const newTracks = buildQueue(musicPosts);

      // Filter out duplicates
      const existingIds = new Set(queue.map((t) => t.id));
      const uniqueNewTracks = newTracks.filter((t) => !existingIds.has(t.id));

      if (uniqueNewTracks.length > 0) {
        setQueue([...queue, ...uniqueNewTracks]);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load more tracks";
      setLoadMoreError(message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Show loading state while fetching client-side
  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Loader2 className="h-16 w-16 text-muted-foreground mb-4 animate-spin" />
        <h2 className="text-2xl font-semibold">Loading tracks...</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          Fetching music from r/{subreddit}
        </p>
      </div>
    );
  }

  // Show error if client-side fetch failed
  if (initialLoadError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Radio className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold">Failed to load</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          {initialLoadError}
        </p>
        <div className="mt-6">
          <SortSelector onSortChange={handleSortChange} />
        </div>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Radio className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">No music found</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          r/{subreddit} doesn&apos;t have any YouTube or SoundCloud links right now.
          Try a different sort method or check back later.
        </p>
        <div className="mt-6">
          <SortSelector onSortChange={handleSortChange} />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 container mx-auto px-4 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-8">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            r/{subreddit}
          </h1>
          <p className="text-muted-foreground mt-1">
            {queue.length} {queue.length === 1 ? "track" : "tracks"} currated
          </p>
        </div>
        <SortSelector onSortChange={handleSortChange} />
      </div>

      <div className="grid gap-8 grid-cols-1">
          {/* Main Queue List */}
          <div className="space-y-4">
              <PlaylistView />
              <div className="p-4 flex justify-center">
                  <Button
                    variant="outline"
                    className="w-full max-w-xs backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More Tracks"
                    )}
                  </Button>
                  {loadMoreError && (
                    <p className="text-sm text-destructive text-center mt-2">
                      {loadMoreError}
                    </p>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}
