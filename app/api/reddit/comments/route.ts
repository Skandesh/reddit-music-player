import { NextRequest, NextResponse } from "next/server";
import { getPostComments } from "@/lib/reddit";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const subreddit = searchParams.get("subreddit");
  const postId = searchParams.get("postId");

  if (!subreddit || !postId) {
    return NextResponse.json(
      { error: "Missing subreddit or postId parameter" },
      { status: 400 }
    );
  }

  try {
    const comments = await getPostComments(subreddit, postId);
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
