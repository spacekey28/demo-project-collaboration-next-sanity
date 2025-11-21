"use client";

import { BookIcon } from "lucide-react";
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
import type { DocPage } from "@/lib/sanity/zod";

type DocSearchProps = {
  docs: DocPage[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function DocSearch({
  docs,
  open: controlledOpen,
  onOpenChange,
}: DocSearchProps) {
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

  function handleSelect(doc: DocPage) {
    router.push(`/docs/${doc.slug.current}`);
    setIsOpen(false);
  }

  // Extract preview text from Portable Text content
  function getPreviewText(content: DocPage["content"]): string {
    if (!content || !Array.isArray(content)) return "";
    for (const block of content) {
      if (block && typeof block === "object" && "_type" in block) {
        if ((block as { _type?: string })._type === "block") {
          const children = (block as { children?: unknown[] }).children;
          if (Array.isArray(children)) {
            const text = children
              .map((child) => {
                if (child && typeof child === "object" && "text" in child) {
                  return String((child as { text?: unknown }).text ?? "");
                }
                return "";
              })
              .join("")
              .trim();
            if (text) return text.slice(0, 60);
          }
        }
      }
    }
    return "";
  }

  return (
    <>
      {controlledOpen === undefined && (
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="text-muted-foreground relative h-9 w-full justify-start text-sm sm:pr-12 md:w-40 lg:w-64"
        >
          <span className="hidden lg:inline-flex">Search documentation...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="bg-muted pointer-events-none absolute top-1.5 right-1.5 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}

      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Search Documentation"
        description="Search for documentation pages by title or content."
      >
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No documentation found.</CommandEmpty>
          {docs.length > 0 && (
            <CommandGroup heading="Documentation">
              {docs.map((doc) => {
                const preview = getPreviewText(doc.content);
                return (
                  <CommandItem
                    key={doc._id}
                    value={`${doc.title} ${doc.category ?? ""} ${preview}`}
                    onSelect={() => handleSelect(doc)}
                    className="cursor-pointer"
                  >
                    <BookIcon className="mr-2 size-4" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{doc.title}</span>
                        {doc.category && (
                          <span className="text-muted-foreground text-xs">
                            {doc.category}
                          </span>
                        )}
                      </div>
                      {preview && (
                        <span className="text-muted-foreground text-xs">
                          {preview}...
                        </span>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
