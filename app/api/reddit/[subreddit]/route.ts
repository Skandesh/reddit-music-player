import { NextRequest, NextResponse } from "next/server";
import { getSubredditPosts, filterMusicPosts, validateSubredditName, RedditApiError } from "@/lib/reddit";
import { buildQueue } from "@/lib/youtube";
import type { SortMethod, TimePeriod } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subreddit: string }> }
) {
  const { subreddit } = await params;
  const searchParams = request.nextUrl.searchParams;
  const sort = (searchParams.get("sort") as SortMethod) || "hot";
  const time = (searchParams.get("t") as TimePeriod) || "week";
  const limit = parseInt(searchParams.get("limit") || "50");

  if (!validateSubredditName(subreddit)) {
    return NextResponse.json(
      { error: "Invalid subreddit name" },
      { status: 400 }
    );
  }

  try {
    const { posts, after } = await getSubredditPosts(subreddit, sort, limit, time);
    const musicPosts = filterMusicPosts(posts);
    const queue = buildQueue(musicPosts);

    return NextResponse.json({
      subreddit,
      queue,
      total: queue.length,
      after,
    });
  } catch (error) {
    if (error instanceof RedditApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: `Failed to fetch r/${subreddit}` },
      { status: 500 }
    );
  }
}
