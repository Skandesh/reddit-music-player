"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  ListMusic,
  Radio,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSubredditStore } from "@/stores/subredditStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useState } from "react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/browse", icon: Compass, label: "Browse" },
  { href: "/playlist", icon: ListMusic, label: "Queue" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { selected, removeSubreddit } = useSubredditStore();
  const { queue } = usePlayerStore();
  const [isSubredditsOpen, setIsSubredditsOpen] = useState(true);

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Radio className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Reddit Music</span>
        </Link>
      </div>

      <nav className="px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.label === "Queue" && queue.length > 0 && (
                <span className="ml-auto text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  {queue.length}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 px-2">
        <button
          onClick={() => setIsSubredditsOpen(!isSubredditsOpen)}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
        >
          {isSubredditsOpen ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          My Subreddits
          <span className="ml-auto text-xs font-normal">({selected.length})</span>
        </button>
      </div>

      {isSubredditsOpen && (
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 pb-4">
            {selected.map((sub) => {
              const isActive = pathname === `/r/${sub}`;
              return (
                <div
                  key={sub}
                  className={cn(
                    "group flex items-center rounded-lg transition-colors",
                    isActive ? "bg-accent" : "hover:bg-accent/50"
                  )}
                >
                  <Link
                    href={`/r/${sub}`}
                    className={cn(
                      "flex-1 px-3 py-2 text-sm truncate",
                      isActive
                        ? "text-accent-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    r/{sub}
                  </Link>
                  {selected.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 mr-1"
                      onClick={(e) => {
                        e.preventDefault();
                        removeSubreddit(sub);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}

      <div className="p-4 border-t">
        <Link href="/browse">
          <Button variant="outline" size="sm" className="w-full">
            <Compass className="h-4 w-4 mr-2" />
            Browse Subreddits
          </Button>
        </Link>
      </div>
    </aside>
  );
}
