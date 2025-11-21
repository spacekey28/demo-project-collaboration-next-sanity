import "@/styles/globals.css";

import type { ReactNode } from "react";

import { PreviewModeIndicator } from "@/components/preview-mode-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { fonts } from "@/lib/fonts";

export const metadata = {
  title: {
    default: "Flowspace",
    template: "%s | Flowspace",
  },
  description: "Flowspace helps teams collaborate and communicate.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-background text-foreground min-h-screen ${fonts.join(" ")}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PreviewModeIndicator />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
