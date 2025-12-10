"use client";

import { Flame, Clock, TrendingUp, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSubredditStore } from "@/stores/subredditStore";
import type { SortMethod, TimePeriod } from "@/types";

const sortOptions: { value: SortMethod; label: string; icon: typeof Flame }[] = [
  { value: "hot", label: "Hot", icon: Flame },
  { value: "new", label: "New", icon: Clock },
  { value: "top", label: "Top", icon: TrendingUp },
  { value: "rising", label: "Rising", icon: ArrowUpRight },
];

const timeOptions: { value: TimePeriod; label: string }[] = [
  { value: "hour", label: "Past Hour" },
  { value: "day", label: "Past 24 Hours" },
  { value: "week", label: "Past Week" },
  { value: "month", label: "Past Month" },
  { value: "year", label: "Past Year" },
  { value: "all", label: "All Time" },
];

interface SortSelectorProps {
  onSortChange?: (sort: SortMethod, time?: TimePeriod) => void;
}

export function SortSelector({ onSortChange }: SortSelectorProps) {
  const { sortMethod, timePeriod, setSortMethod, setTimePeriod } =
    useSubredditStore();

  const handleSortChange = (sort: SortMethod) => {
    setSortMethod(sort);
    onSortChange?.(sort, sort === "top" ? timePeriod : undefined);
  };

  const handleTimeChange = (time: TimePeriod) => {
    setTimePeriod(time);
    onSortChange?.(sortMethod, time);
  };

  const currentSort = sortOptions.find((s) => s.value === sortMethod);
  const CurrentIcon = currentSort?.icon || Flame;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <CurrentIcon className="h-4 w-4" />
            {currentSort?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={cn(sortMethod === option.value && "bg-accent")}
            >
              <option.icon className="h-4 w-4 mr-2" />
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {sortMethod === "top" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {timeOptions.find((t) => t.value === timePeriod)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {timeOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleTimeChange(option.value)}
                className={cn(timePeriod === option.value && "bg-accent")}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
