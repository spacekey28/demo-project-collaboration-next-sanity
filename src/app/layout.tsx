import type { ReactNode } from "react";

export const metadata = {
  title: {
    default: "Flowspace",
    template: "%s | Flowspace",
  },
  description: "Flowspace helps teams collaborate and communicate.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
