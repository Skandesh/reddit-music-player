"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DEFAULT_SUBREDDITS } from "@/config/subreddits";
import { useSubredditStore } from "@/stores/subredditStore";

export default function BrowsePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { selected, addSubreddit, removeSubreddit } = useSubredditStore();

  const categories = useMemo(() => {
    const cats = new Set<string>();
    DEFAULT_SUBREDDITS.forEach((sub) => cats.add(sub.category));
    return Array.from(cats).sort();
  }, []);

  const filteredSubreddits = useMemo(() => {
    return DEFAULT_SUBREDDITS.filter((sub) => {
      const matchesSearch =
        searchQuery === "" ||
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || sub.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedSubreddits = useMemo(() => {
    const groups: Record<string, typeof DEFAULT_SUBREDDITS> = {};
    filteredSubreddits.forEach((sub) => {
      if (!groups[sub.category]) {
        groups[sub.category] = [];
      }
      groups[sub.category].push(sub);
    });
    return groups;
  }, [filteredSubreddits]);

  const toggleSubreddit = (name: string) => {
    if (selected.includes(name)) {
      if (selected.length > 1) {
        removeSubreddit(name);
      }
    } else {
      addSubreddit(name);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold">Browse Subreddits</h1>
        <p className="text-muted-foreground mt-1">
          Discover music communities and add them to your playlist
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subreddits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          All ({DEFAULT_SUBREDDITS.length})
        </Badge>
        {categories.map((category) => {
          const count = DEFAULT_SUBREDDITS.filter(
            (s) => s.category === category
          ).length;
          return (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({count})
            </Badge>
          );
        })}
      </div>

      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-8 pr-4">
          {Object.entries(groupedSubreddits).map(([category, subreddits]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-4">{category}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subreddits.map((sub) => {
                  const isSelected = selected.includes(sub.name);
                  return (
                    <Card
                      key={sub.name}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-accent/50",
                        isSelected && "border-primary bg-accent/30"
                      )}
                      onClick={() => router.push(`/r/${sub.name}`)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm font-medium truncate">
                              r/{sub.name}
                            </CardTitle>
                            {sub.description && (
                              <CardDescription className="text-xs mt-1 line-clamp-2">
                                {sub.description}
                              </CardDescription>
                            )}
                          </div>
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubreddit(sub.name);
                            }}
                          >
                            {isSelected ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {selected.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:left-64">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="text-sm">
              <span className="font-medium">{selected.length}</span> subreddits
              selected
            </div>
            <Button onClick={() => router.push(`/r/${selected.join("+")}`)}>
              Play All Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
