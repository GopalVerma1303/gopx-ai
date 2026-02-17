"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-muted/60 border border-border/50" />
          <h1 className="text-lg font-semibold text-foreground">
            Gopx AI
          </h1>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
