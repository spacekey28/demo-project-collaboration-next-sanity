"use client";

import { EyeIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function PreviewModeIndicator() {
  const [isPreview, setIsPreview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if preview mode cookie exists
    const checkPreviewMode = () => {
      const cookies = document.cookie.split(";");
      const previewCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("__prerender_bypass="),
      );
      setIsPreview(!!previewCookie);
    };

    checkPreviewMode();

    // Check periodically in case cookie is set/removed
    const interval = setInterval(checkPreviewMode, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleExitPreview() {
    try {
      const response = await fetch("/api/exit-preview", {
        method: "GET",
      });

      if (response.ok) {
        setIsPreview(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to exit preview mode:", error);
    }
  }

  if (!isPreview) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 border-b border-yellow-600 bg-yellow-500 px-4 py-2 text-center text-sm font-medium text-yellow-950 dark:border-yellow-700 dark:bg-yellow-600 dark:text-yellow-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeIcon className="size-4" />
          <span>Preview Mode: You are viewing draft content</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExitPreview}
          className="h-7 text-yellow-950 hover:bg-yellow-400 dark:text-yellow-50 dark:hover:bg-yellow-700"
        >
          <XIcon className="mr-1 size-3" />
          Exit Preview
        </Button>
      </div>
    </div>
  );
}
