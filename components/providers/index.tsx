"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "./toast-provider";
import { AppStoreProvider } from "./app-store";
import { SearchProvider } from "@/components/shell/search-overlay";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AppStoreProvider>
        <ToastProvider>
          <TooltipProvider delayDuration={200}>
            <SearchProvider>{children}</SearchProvider>
          </TooltipProvider>
        </ToastProvider>
      </AppStoreProvider>
    </ThemeProvider>
  );
}
