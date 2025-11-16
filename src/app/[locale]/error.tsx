"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        <h1 className="mb-2 text-2xl font-bold">We hit a snag</h1>
        <p className="text-muted-foreground mb-4">
          {process.env.NODE_ENV !== "production"
            ? error.message
            : "Please try again or return to the homepage."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => reset()} className="cursor-pointer">
            Retry
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
