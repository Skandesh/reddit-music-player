"use client";

import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchCommand } from "@/components/search/SearchCommand";
import { MobileNav } from "./MobileNav";

export function TopBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <div className="flex-1 flex items-center gap-4">
            <Button
              variant="outline"
              className="relative h-9 w-full max-w-sm justify-start text-sm text-muted-foreground md:w-64"
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  bubbles: true,
                });
                document.dispatchEvent(event);
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">Ctrl</span>K
              </kbd>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://reddit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Reddit
              </a>
            </Button>
          </div>
        </div>
      </header>

      <SearchCommand />

      {isMobileMenuOpen && (
        <MobileNav onClose={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
}
