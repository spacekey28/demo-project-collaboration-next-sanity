"use client";

import { FileTextIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { BlogPostWithAuthor } from "@/lib/sanity/zod";

type BlogSearchProps = {
  posts: BlogPostWithAuthor[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function BlogSearch({
  posts,
  open: controlledOpen,
  onOpenChange,
}: BlogSearchProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const router = useRouter();

  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (controlledOpen !== undefined) return; // Don't handle if externally controlled

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setInternalOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [controlledOpen]);

  function handleSelect(post: BlogPostWithAuthor) {
    router.push(`/blog/${post.slug.current}`);
    setIsOpen(false);
  }

  return (
    <>
      {controlledOpen === undefined && (
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="text-muted-foreground relative h-9 w-full justify-start text-sm sm:pr-12 md:w-40 lg:w-64"
        >
          <span className="hidden lg:inline-flex">Search blog posts...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="bg-muted pointer-events-none absolute top-1.5 right-1.5 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}

      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Search Blog Posts"
        description="Search for blog posts by title, content, or tags."
      >
        <CommandInput placeholder="Search blog posts..." />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6">
              <p className="text-muted-foreground text-sm">
                No blog posts found.
              </p>
              <p className="text-muted-foreground text-xs">
                Try searching with different keywords or browse all posts.
              </p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="Posts">
            {posts.map((post) => (
              <CommandItem
                key={post._id}
                value={`${post.title} ${post.excerpt ?? ""} ${post.tags?.join(" ") ?? ""}`}
                onSelect={() => handleSelect(post)}
                className="cursor-pointer"
              >
                <FileTextIcon className="mr-2 size-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{post.title}</span>
                  {post.excerpt && (
                    <span className="text-muted-foreground text-xs">
                      {post.excerpt.slice(0, 60)}...
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
