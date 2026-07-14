"use client";

import { Bell, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div>
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      <div className="flex items-center gap-2">
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
              3
            </span>
          </Button>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Button variant="ghost" size="icon">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
