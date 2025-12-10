// src/components/subreddit/SubredditSelector.tsx
'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useSubredditStore } from '@/stores/subredditStore';
import { DEFAULT_SUBREDDITS } from '@/config/subreddits';

export function SubredditSelector() {
  const [open, setOpen] = useState(false);
  const { selected, addSubreddit, removeSubreddit } = useSubredditStore();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selected.map((sub) => (
          <Badge key={sub} variant="secondary" className="gap-1">
            r/{sub}
            <button onClick={() => removeSubreddit(sub)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Subreddit
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search subreddits..." />
            <CommandEmpty>No subreddit found. </CommandEmpty>
            <CommandGroup>
              {DEFAULT_SUBREDDITS.map((sub) => (
                <CommandItem
                  key={sub.name}
                  value={sub.name}
                  onSelect={() => {
                    if (!selected.includes(sub.name)) {
                      addSubreddit(sub.name);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.includes(sub.name) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  r/{sub.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
