import type { RedditPost, RedditComment, SortMethod, TimePeriod } from "@/types";

const REDDIT_BASE = "https://www.reddit.com";

export class RedditApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public isRateLimit: boolean = false
  ) {
    super(message);
    this.name = "RedditApiError";
  }
}

export function validateSubredditName(subreddit: string): boolean {
  // Reddit subreddit naming rules: 3-21 chars, alphanumeric + underscores
  // Also supports multi-subreddit format like "music+listentothis"
  const pattern = /^[a-zA-Z0-9_]{2,21}(\+[a-zA-Z0-9_]{2,21})*$/;
  return pattern.test(subreddit);
}

export async function getSubredditPosts(
  subreddit: string,
  sort: SortMethod = "hot",
  limit: number = 50,
  time?: TimePeriod,
  after?: string
): Promise<{ posts: RedditPost[]; after: string | null }> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    raw_json: "1",
  });

  if (sort === "top" && time) {
    params.set("t", time);
  }

  if (after) {
    params.set("after", after);
  }

  const res = await fetch(
    `${REDDIT_BASE}/r/${subreddit}/${sort}.json?${params.toString()}`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    throw new RedditApiError(
      res.status === 404
        ? `Subreddit r/${subreddit} not found`
        : res.status === 429
        ? "Rate limited by Reddit. Please try again later."
        : `Failed to fetch r/${subreddit}`,
      res.status,
      res.status === 429
    );
  }

  const data = await res.json();
  return {
    posts: data.data.children.map((child: { data: RedditPost }) => child.data),
    after: data.data.after,
  };
}

export async function getPostComments(
  subreddit: string,
  postId: string
): Promise<RedditComment[]> {
  const res = await fetch(
    `${REDDIT_BASE}/r/${subreddit}/comments/${postId}.json?raw_json=1`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new RedditApiError(
      `Failed to fetch comments`,
      res.status,
      res.status === 429
    );
  }

  const data = await res.json();
  return parseComments(data[1]?.data?.children || []);
}

function parseComments(
  children: Array<{ kind: string; data: RedditComment }>
): RedditComment[] {
  return children
    .filter((child) => child.kind === "t1")
    .map((child) => child.data);
}

export function filterMusicPosts(posts: RedditPost[]): RedditPost[] {
  return posts.filter(
    (post) =>
      isYouTubeUrl(post.url) ||
      isSoundCloudUrl(post.url) ||
      isVimeoUrl(post.url)
  );
}

export function isYouTubeUrl(url: string): boolean {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("youtube-nocookie.com")
  );
}

export function isSoundCloudUrl(url: string): boolean {
  return url.includes("soundcloud.com");
}

export function isVimeoUrl(url: string): boolean {
  return url.includes("vimeo.com");
}

export async function searchSubreddit(
  subreddit: string,
  query: string,
  limit: number = 25
): Promise<RedditPost[]> {
  const params = new URLSearchParams({
    q: query,
    restrict_sr: "on",
    limit: limit.toString(),
    raw_json: "1",
  });

  const res = await fetch(
    `${REDDIT_BASE}/r/${subreddit}/search.json?${params.toString()}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new RedditApiError(
      `Failed to search r/${subreddit}`,
      res.status,
      res.status === 429
    );
  }

  const data = await res.json();
  return data.data.children.map((child: { data: RedditPost }) => child.data);
}
