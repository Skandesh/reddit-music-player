// src/app/(player)/r/[subreddit]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function SubredditLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <Skeleton className="h-4 w-8" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
