"use client";

import { usePlayerStore } from "@/stores/playerStore";
import { CommentsPanel } from "@/components/comments/CommentsPanel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function RightSidebar() {
  const { isCommentsOpen, toggleComments } = usePlayerStore();

  if (!isCommentsOpen) return null;

  return (
    <aside className="hidden lg:flex w-96 flex-col border-l bg-background/50 backdrop-blur-xl transition-all duration-300 border-white/5">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h3 className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Comments
        </h3>
        <Button variant="ghost" size="icon" onClick={toggleComments} className="h-8 w-8 hover:bg-white/10">
            <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <CommentsPanel />
      </div>
    </aside>
  );
}
