"use client";

import { useState } from "react";
import { Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const shortcuts = [
  { key: "Space", description: "Play / Pause" },
  { key: "Shift + →", description: "Next track" },
  { key: "Shift + ←", description: "Previous track" },
  { key: "Shift + ↑", description: "Volume up" },
  { key: "Shift + ↓", description: "Volume down" },
  { key: "M", description: "Mute / Unmute" },
  { key: "Shift + S", description: "Shuffle queue" },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
