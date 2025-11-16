import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        <h1 className="mb-2 text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground mb-4">
          The page you are looking for doesn’t exist.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
