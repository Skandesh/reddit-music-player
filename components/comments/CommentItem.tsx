"use client";

import { useState } from "react";
import DOMPurify from "dompurify";
import { ArrowUp, ChevronDown, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RedditComment } from "@/types";

interface CommentItemProps {
  comment: RedditComment;
  depth?: number;
  isOP?: boolean;
}

export function CommentItem({ comment, depth = 0, isOP = false }: CommentItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const maxDepth = 6;

  const replies =
    comment.replies?.data?.children
      ?.filter((child) => child.kind === "t1")
      ?.map((child) => child.data) || [];

  if (comment.author === "[deleted]" && !comment.body) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative",
        depth > 0 && "ml-4 pl-4 border-l-2 border-border"
      )}
    >
      <div className="py-2">
        <div className="flex items-center gap-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand comment" : "Collapse comment"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          <div className="flex items-center gap-1 text-muted-foreground">
            <User className="h-3 w-3" />
            <span
              className={cn(
                "font-medium",
                comment.author === "[deleted]"
                  ? "text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {comment.author}
            </span>
          </div>

          {isOP && (
            <Badge variant="secondary" className="text-xs py-0">
              OP
            </Badge>
          )}

          <div className="flex items-center gap-1 text-muted-foreground">
            <ArrowUp className="h-3 w-3" />
            <span>{formatNumber(comment.score)}</span>
          </div>

          <span className="text-muted-foreground text-xs">
            {formatRelativeTime(comment.created_utc)}
          </span>

          {isCollapsed && replies.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({replies.length} {replies.length === 1 ? "reply" : "replies"})
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-2 ml-8">
            <div
              className="text-sm prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(comment.body_html || comment.body),
              }}
            />
          </div>
        )}
      </div>

      {!isCollapsed && replies.length > 0 && depth < maxDepth && (
        <div className="mt-1">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              isOP={reply.is_submitter}
            />
          ))}
        </div>
      )}

      {!isCollapsed && replies.length > 0 && depth >= maxDepth && (
        <div className="ml-4 py-2">
          <Button variant="link" size="sm" className="text-xs p-0 h-auto" asChild>
            <a
              href={`https://reddit.com${comment.permalink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Continue thread
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

function sanitizeHTML(html: string): string {
  if (typeof window === "undefined") return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  const decoded = txt.value;
  return DOMPurify.sanitize(decoded, {
    ALLOWED_TAGS: ["a", "p", "br", "strong", "em", "code", "pre", "blockquote", "ul", "ol", "li", "del", "sup", "sub", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "table", "thead", "tbody", "tr", "th", "td"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}
