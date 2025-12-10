"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ListMusic, Radio, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSubredditStore } from "@/stores/subredditStore";
import { usePlayerStore } from "@/stores/playerStore";

interface MobileNavProps {
  onClose: () => void;
}

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/browse", icon: Compass, label: "Browse" },
  { href: "/playlist", icon: ListMusic, label: "Queue" },
];

export function MobileNav({ onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { selected, removeSubreddit } = useSubredditStore();
  const { queue } = usePlayerStore();

  return (
    <div className="fixed inset-0 top-14 z-50 bg-background md:hidden">
      <ScrollArea className="h-full">
        <div className="p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-base transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
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

          <div className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              My Subreddits ({selected.length})
            </h3>
            <div className="space-y-1">
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
                      onClick={onClose}
                      className={cn(
                        "flex-1 flex items-center gap-3 px-3 py-3 text-base",
                        isActive
                          ? "text-accent-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      <Radio className="h-4 w-4" />
                      r/{sub}
                    </Link>
                    {selected.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 mr-2"
                        onClick={(e) => {
                          e.preventDefault();
                          removeSubreddit(sub);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <Link href="/browse" onClick={onClose}>
              <Button variant="outline" className="w-full">
                <Compass className="h-4 w-4 mr-2" />
                Browse More Subreddits
              </Button>
            </Link>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
