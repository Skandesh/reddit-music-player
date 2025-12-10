import type { RedditPost, QueueItem, VideoInfo } from "@/types";

const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

const VIMEO_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/;

export function extractVideoId(url: string): VideoInfo | null {
  // YouTube
  const ytMatch = url.match(YOUTUBE_REGEX);
  if (ytMatch) {
    return {
      id: ytMatch[1],
      platform: "youtube",
      url: `https://www.youtube.com/watch?v=${ytMatch[1]}`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(VIMEO_REGEX);
  if (vimeoMatch) {
    return {
      id: vimeoMatch[1],
      platform: "vimeo",
      url: `https://vimeo.com/${vimeoMatch[1]}`,
    };
  }

  // SoundCloud
  if (url.includes("soundcloud.com")) {
    return {
      id: url,
      platform: "soundcloud",
      url,
    };
  }

  return null;
}

export function buildQueue(posts: RedditPost[]): QueueItem[] {
  const items: QueueItem[] = [];

  for (const post of posts) {
    const video = extractVideoId(post.url);
    if (!video) continue;

    const item: QueueItem = {
      id: post.id,
      title: post.title,
      author: post.author,
      score: post.score,
      commentCount: post.num_comments,
      subreddit: post.subreddit,
      video,
      permalink: post.permalink,
      createdAt: post.created_utc,
    };

    if (post.thumbnail) item.thumbnail = post.thumbnail;
    if (post.selftext) item.selftext = post.selftext;
    if (post.is_self) item.isSelfPost = post.is_self;

    items.push(item);
  }

  return items;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}
