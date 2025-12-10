import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubredditPosts, filterMusicPosts } from "@/lib/reddit";
import { buildQueue } from "@/lib/youtube";
import { SubredditView } from "@/components/subreddit/SubredditView";
import type { SortMethod, TimePeriod } from "@/types";

interface Props {
  params: Promise<{ subreddit: string }>;
  searchParams: Promise<{ sort?: SortMethod; t?: TimePeriod }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subreddit } = await params;

  return {
    title: `r/${subreddit} - Reddit Music Player`,
    description: `Listen to music from r/${subreddit} subreddit. Stream YouTube and SoundCloud tracks curated by the Reddit community.`,
    openGraph: {
      title: `r/${subreddit} - Reddit Music Player`,
      description: `Stream music from r/${subreddit}`,
      type: "website",
    },
  };
}

export default async function SubredditPage({ params, searchParams }: Props) {
  const { subreddit } = await params;
  const { sort = "hot", t = "week" } = await searchParams;

  let queue;
  try {
    const { posts } = await getSubredditPosts(subreddit, sort, 50, t);
    const musicPosts = filterMusicPosts(posts);
    queue = buildQueue(musicPosts);
  } catch {
    notFound();
  }

  return (
    <SubredditView
      subreddit={subreddit}
      initialQueue={queue}
      initialSort={sort}
      initialTime={t}
    />
  );
}
