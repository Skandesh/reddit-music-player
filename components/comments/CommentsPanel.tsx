// src/components/comments/CommentsPanel. tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { CommentItem } from './CommentItem';
import { usePlayerStore } from '@/stores/playerStore';
import type { RedditComment } from '@/types';

async function fetchComments(subreddit: string, postId: string): Promise<RedditComment[]> {
  const params = new URLSearchParams({ subreddit, postId });
  const res = await fetch(`/api/reddit/comments?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }
  const data = await res.json();
  return data.comments;
}

export function CommentsPanel() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  const { data: comments, isLoading, isError, error } = useQuery({
    queryKey: ['comments', currentTrack?.id],
    queryFn: () => fetchComments(currentTrack!.subreddit, currentTrack!.id),
    enabled: !!currentTrack,
    staleTime: 60 * 1000,
  });

  if (!currentTrack) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Select a track to view comments
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Failed to load comments</p>
        <p className="text-sm text-muted-foreground mt-1">
          {error instanceof Error ? error.message : "Please try again later"}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <h3 className="font-semibold">Comments ({comments?.length || 0})</h3>
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isOP={comment.is_submitter}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
