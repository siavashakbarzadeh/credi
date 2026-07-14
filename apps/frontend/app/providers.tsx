"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { queryClient } from "../lib/query-client";
import { Toaster } from "../components/notifications/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
