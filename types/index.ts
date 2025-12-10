export interface VideoInfo {
  id: string;
  platform: "youtube" | "soundcloud" | "vimeo";
  url: string;
}

export interface QueueItem {
  id: string;
  title: string;
  author: string;
  score: number;
  commentCount: number;
  subreddit: string;
  video: VideoInfo;
  permalink: string;
  createdAt: number;
  thumbnail?: string;
  selftext?: string;
  isSelfPost?: boolean;
}

export interface RedditPost {
  id: string;
  title: string;
  author: string;
  score: number;
  num_comments: number;
  subreddit: string;
  url: string;
  permalink: string;
  created_utc: number;
  thumbnail?: string;
  selftext?: string;
  is_self?: boolean;
  domain?: string;
  ups: number;
  downs: number;
}

export interface RedditComment {
  id: string;
  author: string;
  body: string;
  body_html: string;
  score: number;
  created_utc: number;
  replies?: RedditCommentListing;
  is_submitter: boolean;
  depth: number;
  permalink: string;
}

export interface RedditCommentListing {
  kind: string;
  data: {
    children: Array<{
      kind: string;
      data: RedditComment;
    }>;
  };
}

export interface SubredditInfo {
  name: string;
  category: string;
  description?: string;
}

export type SortMethod = "hot" | "new" | "top" | "rising";
export type TimePeriod = "hour" | "day" | "week" | "month" | "year" | "all";
