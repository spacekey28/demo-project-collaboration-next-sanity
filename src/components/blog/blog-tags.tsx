import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BlogTagsProps = {
  tags: string[];
  activeTag?: string | null;
  onSelect?: (tag: string | null) => void;
  className?: string;
};

export function BlogTags({
  tags,
  activeTag,
  onSelect,
  className,
}: BlogTagsProps) {
  if (!tags?.length) return null;
  const unique = Array.from(new Set(tags));

  function handleClick(tag: string | null) {
    if (onSelect) onSelect(tag);
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <TagButton isActive={!activeTag} onClick={() => handleClick(null)}>
        All
      </TagButton>
      {unique.map((tag) => (
        <TagButton
          key={tag}
          isActive={activeTag === tag}
          onClick={() => handleClick(tag)}
        >
          {tag}
        </TagButton>
      ))}
    </div>
  );
}

function TagButton({
  children,
  isActive,
  onClick,
}: {
  children: ReactNode;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "border-muted text-muted-foreground hover:border-foreground",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
