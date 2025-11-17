import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BlogTagsProps = {
  tags: string[];
  activeTag?: string | null;
  onSelect?: (tag: string | null) => void;
  className?: string;
  buildHref?: (tag: string | null) => string;
};

export function BlogTags({
  tags,
  activeTag,
  onSelect,
  className,
  buildHref,
}: BlogTagsProps) {
  if (!tags?.length) return null;
  const unique = Array.from(new Set(tags));

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {renderTag({
        label: "All",
        tag: null,
        isActive: !activeTag,
        onSelect,
        buildHref,
      })}
      {unique.map((tag) =>
        renderTag({
          label: tag,
          tag,
          isActive: activeTag === tag,
          onSelect,
          buildHref,
        }),
      )}
    </div>
  );
}

function renderTag({
  label,
  tag,
  isActive,
  onSelect,
  buildHref,
}: {
  label: string;
  tag: string | null;
  isActive: boolean;
  onSelect?: (tag: string | null) => void;
  buildHref?: (tag: string | null) => string;
}) {
  if (buildHref) {
    const href = buildHref(tag);
    return (
      <TagLink key={label} href={href} isActive={isActive}>
        {label}
      </TagLink>
    );
  }

  function handleClick() {
    if (onSelect) onSelect(tag);
  }
  return (
    <TagButton key={label} isActive={isActive} onClick={handleClick}>
      {label}
    </TagButton>
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

function TagLink({
  children,
  href,
  isActive,
}: {
  children: ReactNode;
  href: string;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "border-muted text-muted-foreground hover:border-foreground",
      )}
    >
      {children}
    </Link>
  );
}
