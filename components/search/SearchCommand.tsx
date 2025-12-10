// src/components/search/SearchCommand.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Search, Music, Radio } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { DEFAULT_SUBREDDITS } from '@/config/subreddits';

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queue = usePlayerStore((state) => state.queue);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search tracks, subreddits..." />
      <CommandList>
        <CommandEmpty>No results found. </CommandEmpty>

        <CommandGroup heading="Subreddits">
          {DEFAULT_SUBREDDITS.slice(0, 5).map((sub) => (
            <CommandItem
              key={sub.name}
              onSelect={() => {
                router.push(`/r/${sub.name}`);
                setOpen(false);
              }}
            >
              <Radio className="mr-2 h-4 w-4" />
              r/{sub.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="In Queue">
          {queue.slice(0, 5).map((track, index) => (
            <CommandItem
              key={track.id}
              onSelect={() => {
                usePlayerStore.getState().playTrack(index);
                setOpen(false);
              }}
            >
              <Music className="mr-2 h-4 w-4" />
              {track.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
